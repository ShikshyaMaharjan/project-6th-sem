import patanImage from "../assets/images/heritage/patan-durbar-square.jpg"
import bhaktapurImage from "../assets/images/heritage/bhaktapur-durbar-square.jpg"
import kathmanduImage from "../assets/images/heritage/kathmandu-durbar-square.jpg"

import yomariImage from "../assets/images/food/yomari.jpg"
import baraImage from "../assets/images/food/bara.jpg"
import chatamariImage from "../assets/images/food/chatamari.jpg"

import indraJatraImage from "../assets/images/festivals/indra-jatra.jpg"
import bisketJatraImage from "../assets/images/festivals/bisket-jatra.jpg"
import gaiJatraImage from "../assets/images/festivals/gai-jatra.jpg"

import hakuPatasiImage from "../assets/images/attire/haku-patasi.jpg"
import tapalanImage from "../assets/images/attire/tapalan.jpg"
import bhantaImage from "../assets/images/attire/bhanta.jpg"

import lusuwyaImage from "../assets/images/jewelry/lusuwya.jpg"
import nyapuSikhaImage from "../assets/images/jewelry/Nyapu-Sikha.jpg"
import tayoImage from "../assets/images/jewelry/tayo.jpg"


export const culturalItems = [

  // =====================================================
  // HERITAGE SITES
  // =====================================================

  {
    slug: "patan-durbar-square",
    title: "Patan Durbar Square",
    category: "Heritage Sites",
    location: "Lalitpur, Nepal",
    image: patanImage,

    relatedSlugs: ["bhaktapur-durbar-square"],

    description:
      "A historic cultural site known for its traditional Newari architecture and artistic heritage.",

    significance:
      "The site represents the rich architectural and artistic traditions of the Kathmandu Valley and remains an important place for cultural and religious activities.",
  },

  {
    slug: "bhaktapur-durbar-square",
    title: "Bhaktapur Durbar Square",
    category: "Heritage Sites",
    location: "Bhaktapur, Nepal",
    image: bhaktapurImage,

    description:
      "A historic square known for its traditional architecture, temples, courtyards, and artistic craftsmanship.",

    significance:
      "Bhaktapur Durbar Square reflects the historical architecture and artistic traditions of the Kathmandu Valley.",
  },

  {
    slug: "kathmandu-durbar-square",
    title: "Kathmandu Durbar Square",
    category: "Heritage Sites",
    location: "Kathmandu, Nepal",
    image: kathmanduImage,

    description:
      "A historic urban square containing temples, palaces, courtyards, and traditional architectural structures.",

    significance:
      "The square represents an important part of Kathmandu's historical, architectural, religious, and cultural landscape.",
  },


  // =====================================================
  // FOOD & RECIPES
  // =====================================================

  {
    slug: "yomari",
    title: "Yomari",
    category: "Food & Recipes",
    location: "Kathmandu Valley, Nepal",
    image: yomariImage,

    relatedSlugs: ["bara"],

    description:
      "A traditional Newari steamed delicacy made from rice flour and commonly filled with sweet fillings.",

    significance:
      "Yomari is especially associated with Yomari Punhi and represents an important part of Newar food traditions.",
  },

  {
    slug: "bara",
    title: "Bara",
    category: "Food & Recipes",
    location: "Kathmandu Valley, Nepal",
    image: baraImage,

    relatedSlugs: ["chatamari"],

    description:
      "A traditional Newari savory pancake commonly prepared from lentil batter and enjoyed as part of Newari cuisine.",

    significance:
      "Bara is an important example of traditional Newari food and is commonly enjoyed during family and community gatherings.",
  },

  {
    slug: "chatamari",
    title: "Chatamari",
    category: "Food & Recipes",
    location: "Kathmandu Valley, Nepal",
    image: chatamariImage,

    description:
      "A traditional Newari rice-flour dish often described as a savory rice-flour crepe with different toppings.",

    significance:
      "Chatamari represents the distinctive food traditions of the Newar community and remains popular in the Kathmandu Valley.",
  },


  // =====================================================
  // FESTIVALS
  // =====================================================

  {
    slug: "indra-jatra",
    title: "Indra Jatra",
    category: "Festivals",
    location: "Kathmandu, Nepal",
    image: indraJatraImage,

    relatedSlugs: ["bisket-jatra"],

    description:
      "A major Kathmandu festival featuring traditional rituals, chariot processions, masked dances, and community celebrations.",

    significance:
      "The festival brings together religious practices, traditional performances, and community participation in historic areas of Kathmandu.",
  },

  {
    slug: "bisket-jatra",
    title: "Bisket Jatra",
    category: "Festivals",
    location: "Bhaktapur, Nepal",
    image: bisketJatraImage,

    description:
      "A major annual festival in Bhaktapur featuring traditional processions, chariot pulling, rituals, and community celebrations.",

    significance:
      "Bisket Jatra is an important festival that demonstrates the living traditions and community participation of Bhaktapur.",
  },

  {
    slug: "gai-jatra",
    title: "Gai Jatra",
    category: "Festivals",
    location: "Kathmandu Valley, Nepal",
    image: gaiJatraImage,

    description:
      "A traditional festival involving processions, performances, and community gatherings held in remembrance of deceased family members.",

    significance:
      "Gai Jatra combines remembrance, community participation, traditional performances, and cultural expression.",
  },


  // =====================================================
  // TRADITIONAL ATTIRE
  // =====================================================

  {
    slug: "haku-patasi",
    title: "Haku Patasi",
    category: "Traditional Attire",
    location: "Kathmandu Valley, Nepal",
    image: hakuPatasiImage,

    description:
      "A traditional black sari with a red border associated with Newar women of the Kathmandu Valley.",

    significance:
      "Hāku Patāsi is an important expression of Newar identity and continues to be worn during festivals, cultural events, and traditional occasions.",
  },

  {
    slug: "tapalan",
    title: "Tapalan",
    category: "Traditional Attire",
    location: "Kathmandu Valley, Nepal",
    image: tapalanImage,

    description:
      "A traditional long shirt worn as part of men's Newar attire, commonly paired with traditional trousers.",

    significance:
      "Tapālan remains an important element of traditional Newar clothing and is especially visible during cultural events and festivals.",
  },

  {
    slug: "bhanta",
    title: "Bhantanlan",
    category: "Traditional Attire",
    location: "Kathmandu Valley, Nepal",
    image: bhantaImage,

    description:
      "A traditional ankle-length garment associated with the clothing of Newar girls.",

    significance:
      "Bhāntānlan represents one of the traditional forms of Newar clothing and contributes to the diversity of traditional attire in the Kathmandu Valley.",
  },


  // =====================================================
  // JEWELRY
  // =====================================================

  {
    slug: "lusuwya",
    title: "Lusuwya",
    category: "Jewelry",
    location: "Kathmandu Valley, Nepal",
    image: lusuwyaImage,

    description:
      "A traditional Newa jewelry ornament associated with traditional adornment and ceremonial dress.",

    significance:
      "Traditional jewelry forms an important part of Newa ceremonial attire and reflects craftsmanship, identity, and cultural expression.",
  },

  {
    slug: "nyapu-sikha",
    title: "Nyapu Sikha",
    category: "Jewelry",
    location: "Kathmandu Valley, Nepal",
    image: nyapuSikhaImage,

    description:
      "A traditional Newa head ornament worn by women as part of traditional jewelry and ceremonial adornment.",

    significance:
      "Nyapu Sikha is an important traditional ornament commonly associated with Newa women's attire and cultural occasions.",
  },

  {
    slug: "tayo",
    title: "Tayo",
    category: "Jewelry",
    location: "Kathmandu Valley, Nepal",
    image: tayoImage,

    description:
      "A traditional Newa necklace with cultural and religious significance.",

    significance:
      "Tayo is an important Newa jewelry piece associated with traditional dress, special occasions, and cultural symbolism.",
  },

]