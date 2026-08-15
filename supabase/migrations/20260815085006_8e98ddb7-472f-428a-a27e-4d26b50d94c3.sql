CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_key text NOT NULL DEFAULT 'dish-default',
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu public read" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "menu admin write" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER menu_items_updated BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_label text NOT NULL,
  price_per_person numeric(10,2),
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  is_recommended boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages public read" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "packages admin write" ON public.packages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  guest_count integer NOT NULL,
  location text NOT NULL,
  food_preference text NOT NULL,
  package text NOT NULL,
  special_requirements text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage bookings" ON public.bookings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  review text NOT NULL,
  event_type text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published reviews public" ON public.reviews FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "admins manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage messages" ON public.contact_messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.menu_items (name, category, description, price, image_key, sort_order) VALUES
('Chicken 65','Starters','Crispy fried chicken tossed with curry leaves, ginger and red chilli.',180,'chicken65',1),
('Gobi Manchurian','Starters','Golden cauliflower florets in a tangy Indo-Chinese glaze.',150,'gobi',2),
('Paneer Butter Masala','Vegetarian','Soft paneer simmered in a silky tomato-cashew gravy.',220,'paneer',3),
('Veg Biryani','Vegetarian','Fragrant basmati layered with seasonal vegetables and paneer.',200,'veg-biryani',4),
('Chicken Biryani','Non-Vegetarian','Dum-cooked basmati with marinated chicken, saffron and fried onions.',280,'chicken-biryani',5),
('Mutton Biryani','Non-Vegetarian','Slow-cooked mutton with aged basmati and heritage spices.',360,'mutton-biryani',6),
('Hyderabadi Chicken Biryani','Biryani','Our signature dum biryani served with mirchi ka salan and raita.',300,'chicken-biryani',7),
('Ambur Mutton Biryani','Biryani','Seeraga samba rice, tender mutton and a fiery southern masala.',380,'mutton-biryani',8),
('Kadai Paneer','Main Course','Paneer and peppers tossed in freshly ground kadai masala.',240,'paneer',9),
('Chettinad Chicken','Main Course','Roasted spice blend, coconut and slow-cooked chicken.',290,'chicken65',10),
('Parotta','Indian Breads','Flaky layered South Indian parotta, served hot.',30,'parotta',11),
('Butter Naan','Indian Breads','Tandoor-baked naan brushed with fresh butter.',40,'naan',12),
('Gulab Jamun','Desserts','Warm milk dumplings soaked in cardamom saffron syrup.',60,'gulabjamun',13),
('Kulfi & Ice Cream','Desserts','Traditional kulfi and seasonal ice creams with pistachio.',80,'icecream',14),
('Royal Falooda','Beverages','Rose syrup, vermicelli, basil seeds and ice cream.',120,'falooda',15),
('Masala Chaas','Beverages','Spiced buttermilk with curry leaf and ginger.',40,'falooda',16);

INSERT INTO public.packages (name, price_label, price_per_person, description, features, is_recommended, sort_order) VALUES
('Basic','₹299 / person',299,'Perfect for intimate gatherings and simple celebrations.',ARRAY['8 dishes','2 starter options','3 main course items','1 dessert','1 beverage','Basic service staff'],false,1),
('Premium','₹499 / person',499,'Our most loved package for weddings and large functions.',ARRAY['14 dishes','4 starter options','6 main course items','2 desserts','2 beverages','Trained service staff','Partial menu customization'],true,2),
('Deluxe','₹699 / person',699,'A grand multi-cuisine spread with live counters.',ARRAY['20 dishes','6 starter options','8 main course items','3 desserts','3 beverages','Premium service staff','Live cooking counters','Full menu customization'],false,3),
('Custom','Contact Us',NULL,'Tell us your vision and budget, we will craft the menu.',ARRAY['Dishes as per your plan','Curated starter selection','Regional main course','Signature desserts','Beverage counter','Dedicated event manager','Complete menu customization'],false,4);

INSERT INTO public.reviews (customer_name, rating, review, event_type, is_published) VALUES
('Lakshmi Raghavan',5,'The biryani was the talk of our wedding. Guests kept asking who catered it. Service was calm, warm and perfectly on time.','Wedding',true),
('Arun Prakash',5,'We booked Annapurnam for our office annual day for 300 people. Hot food, neat counters and zero delays.','Corporate Event',true),
('Divya Menon',4,'Beautiful presentation for my daughter''s first birthday. The dessert counter was stunning and the team was so friendly.','Birthday',true),
('Suresh Kumar',5,'Authentic South Indian taste for our house warming. The banana leaf sadhya felt exactly like home cooking.','Family Gathering',true);