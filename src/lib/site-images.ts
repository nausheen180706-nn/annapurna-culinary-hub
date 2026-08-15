import heroBiryani from "@/assets/hero-biryani.jpg";
import aboutFeast from "@/assets/about-feast.jpg";
import svcWedding from "@/assets/svc-wedding.jpg";
import svcBirthday from "@/assets/svc-birthday.jpg";
import svcCorporate from "@/assets/svc-corporate.jpg";
import svcEngagement from "@/assets/svc-engagement.jpg";
import svcReligious from "@/assets/svc-religious.jpg";
import svcCollege from "@/assets/svc-college.jpg";
import svcFamily from "@/assets/svc-family.jpg";
import svcCustom from "@/assets/svc-custom.jpg";
import dishMuttonBiryani from "@/assets/dish-mutton-biryani.jpg";
import dishVegBiryani from "@/assets/dish-veg-biryani.jpg";
import dishChicken65 from "@/assets/dish-chicken65.jpg";
import dishPaneer from "@/assets/dish-paneer.jpg";
import dishGobi from "@/assets/dish-gobi.jpg";
import dishParotta from "@/assets/dish-parotta.jpg";
import dishNaan from "@/assets/dish-naan.jpg";
import dishGulabJamun from "@/assets/dish-gulabjamun.jpg";
import dishIceCream from "@/assets/dish-icecream.jpg";
import dishFalooda from "@/assets/dish-falooda.jpg";
import galStaff from "@/assets/gal-staff.jpg";
import galSweets from "@/assets/gal-sweets.jpg";

export {
  heroBiryani,
  aboutFeast,
  svcWedding,
  svcBirthday,
  svcCorporate,
  svcEngagement,
  svcReligious,
  svcCollege,
  svcFamily,
  svcCustom,
  galStaff,
  galSweets,
};

/** Maps the `image_key` stored on menu items to a bundled image. */
export const dishImages: Record<string, string> = {
  "chicken-biryani": heroBiryani,
  "mutton-biryani": dishMuttonBiryani,
  "veg-biryani": dishVegBiryani,
  chicken65: dishChicken65,
  paneer: dishPaneer,
  gobi: dishGobi,
  parotta: dishParotta,
  naan: dishNaan,
  gulabjamun: dishGulabJamun,
  icecream: dishIceCream,
  falooda: dishFalooda,
};

export const dishImageKeys = Object.keys(dishImages);

export function dishImage(key: string | null | undefined): string {
  return (key && dishImages[key]) || heroBiryani;
}
