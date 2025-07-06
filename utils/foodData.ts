export interface FoodItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

export interface SubCategory {
  id: string;
  name: string;
  foods: FoodItem[];
}

export interface MainCategory {
  id: string;
  name: string;
  emoji: string;
  subcategories: SubCategory[];
}

export const commonAllergies = [
  { id: 'peanut', name: '땅콩', emoji: '🥜' },
  { id: 'seafood', name: '해산물', emoji: '🦐' },
  { id: 'shellfish', name: '조개류', emoji: '🦪' },
  { id: 'milk', name: '유제품', emoji: '🥛' },
  { id: 'egg', name: '달걀', emoji: '🥚' },
  { id: 'wheat', name: '밀/글루텐', emoji: '🌾' },
  { id: 'soy', name: '콩', emoji: '🫘' },
  { id: 'fish', name: '생선', emoji: '🐟' },
  { id: 'sesame', name: '참깨', emoji: '🌰' },
  { id: 'tree_nuts', name: '견과류', emoji: '🌰' }
];

export const foodCategories: MainCategory[] = [
  {
    id: 'korean',
    name: '한식',
    emoji: '🍚',
    subcategories: [
      {
        id: 'stew',
        name: '찌개류',
        foods: [
          { id: 'kimchi_stew', name: '김치찌개', category: 'korean', subcategory: 'stew' },
          { id: 'doenjang_stew', name: '된장찌개', category: 'korean', subcategory: 'stew' },
          { id: 'sundubu_stew', name: '순두부찌개', category: 'korean', subcategory: 'stew' },
          { id: 'budae_stew', name: '부대찌개', category: 'korean', subcategory: 'stew' },
          { id: 'cheonggukjang', name: '청국장', category: 'korean', subcategory: 'stew' },
          { id: 'gamjatang', name: '감자탕', category: 'korean', subcategory: 'stew' }
        ]
      },
      {
        id: 'soup',
        name: '국물류',
        foods: [
          { id: 'seolleongtang', name: '설렁탕', category: 'korean', subcategory: 'soup' },
          { id: 'galbitang', name: '갈비탕', category: 'korean', subcategory: 'soup' },
          { id: 'samgyetang', name: '삼계탕', category: 'korean', subcategory: 'soup' },
          { id: 'yukgaejang', name: '육개장', category: 'korean', subcategory: 'soup' },
          { id: 'miyeokguk', name: '미역국', category: 'korean', subcategory: 'soup' },
          { id: 'kongnamulguk', name: '콩나물국', category: 'korean', subcategory: 'soup' }
        ]
      },
      {
        id: 'rice',
        name: '밥류',
        foods: [
          { id: 'bibimbap', name: '비빔밥', category: 'korean', subcategory: 'rice' },
          { id: 'dolsot_bibimbap', name: '돌솥비빔밥', category: 'korean', subcategory: 'rice' },
          { id: 'kimchi_fried_rice', name: '김치볶음밥', category: 'korean', subcategory: 'rice' },
          { id: 'bulgogi_rice', name: '불고기덮밥', category: 'korean', subcategory: 'rice' },
          { id: 'pork_cutlet_rice', name: '돈까스덮밥', category: 'korean', subcategory: 'rice' }
        ]
      },
      {
        id: 'grilled',
        name: '구이류',
        foods: [
          { id: 'bulgogi', name: '불고기', category: 'korean', subcategory: 'grilled' },
          { id: 'galbi', name: '갈비', category: 'korean', subcategory: 'grilled' },
          { id: 'samgyeopsal', name: '삼겹살', category: 'korean', subcategory: 'grilled' },
          { id: 'grilled_fish', name: '생선구이', category: 'korean', subcategory: 'grilled' },
          { id: 'dakgalbi', name: '닭갈비', category: 'korean', subcategory: 'grilled' }
        ]
      },
      {
        id: 'noodles',
        name: '면류',
        foods: [
          { id: 'naengmyeon', name: '냉면', category: 'korean', subcategory: 'noodles' },
          { id: 'bibim_naengmyeon', name: '비빔냉면', category: 'korean', subcategory: 'noodles' },
          { id: 'janchi_guksu', name: '잔치국수', category: 'korean', subcategory: 'noodles' },
          { id: 'mul_naengmyeon', name: '물냉면', category: 'korean', subcategory: 'noodles' }
        ]
      }
    ]
  },
  {
    id: 'chinese',
    name: '중식',
    emoji: '🥢',
    subcategories: [
      {
        id: 'noodles',
        name: '면류',
        foods: [
          { id: 'jajangmyeon', name: '짜장면', category: 'chinese', subcategory: 'noodles' },
          { id: 'jjamppong', name: '짬뽕', category: 'chinese', subcategory: 'noodles' },
          { id: 'gan_jajang', name: '간짜장', category: 'chinese', subcategory: 'noodles' },
          { id: 'sacheon_jajang', name: '사천짜장', category: 'chinese', subcategory: 'noodles' },
          { id: 'ulmyeon', name: '울면', category: 'chinese', subcategory: 'noodles' }
        ]
      },
      {
        id: 'rice',
        name: '밥류',
        foods: [
          { id: 'fried_rice', name: '볶음밥', category: 'chinese', subcategory: 'rice' },
          { id: 'yangzhou_fried_rice', name: '양주볶음밥', category: 'chinese', subcategory: 'rice' },
          { id: 'seafood_fried_rice', name: '해물볶음밥', category: 'chinese', subcategory: 'rice' }
        ]
      },
      {
        id: 'dim_sum',
        name: '만두/딤섬',
        foods: [
          { id: 'mandu', name: '만두', category: 'chinese', subcategory: 'dim_sum' },
          { id: 'xiao_long_bao', name: '샤오롱바오', category: 'chinese', subcategory: 'dim_sum' },
          { id: 'har_gow', name: '하가우', category: 'chinese', subcategory: 'dim_sum' },
          { id: 'siu_mai', name: '슈마이', category: 'chinese', subcategory: 'dim_sum' }
        ]
      },
      {
        id: 'stir_fry',
        name: '볶음류',
        foods: [
          { id: 'sweet_sour_pork', name: '탕수육', category: 'chinese', subcategory: 'stir_fry' },
          { id: 'kung_pao_chicken', name: '궁보계정', category: 'chinese', subcategory: 'stir_fry' },
          { id: 'mapo_tofu', name: '마파두부', category: 'chinese', subcategory: 'stir_fry' },
          { id: 'chili_shrimp', name: '칠리새우', category: 'chinese', subcategory: 'stir_fry' }
        ]
      }
    ]
  },
  {
    id: 'japanese',
    name: '일식',
    emoji: '🍣',
    subcategories: [
      {
        id: 'sushi',
        name: '초밥/회',
        foods: [
          { id: 'sushi', name: '초밥', category: 'japanese', subcategory: 'sushi' },
          { id: 'sashimi', name: '회', category: 'japanese', subcategory: 'sushi' },
          { id: 'chirashi', name: '치라시', category: 'japanese', subcategory: 'sushi' },
          { id: 'salmon_sashimi', name: '연어회', category: 'japanese', subcategory: 'sushi' },
          { id: 'tuna_sashimi', name: '참치회', category: 'japanese', subcategory: 'sushi' }
        ]
      },
      {
        id: 'noodles',
        name: '면류',
        foods: [
          { id: 'ramen', name: '라멘', category: 'japanese', subcategory: 'noodles' },
          { id: 'udon', name: '우동', category: 'japanese', subcategory: 'noodles' },
          { id: 'soba', name: '소바', category: 'japanese', subcategory: 'noodles' },
          { id: 'yakisoba', name: '야키소바', category: 'japanese', subcategory: 'noodles' }
        ]
      },
      {
        id: 'rice_bowls',
        name: '덮밥류',
        foods: [
          { id: 'katsu_don', name: '돈까스덮밥', category: 'japanese', subcategory: 'rice_bowls' },
          { id: 'oyako_don', name: '오야코동', category: 'japanese', subcategory: 'rice_bowls' },
          { id: 'gyudon', name: '규동', category: 'japanese', subcategory: 'rice_bowls' },
          { id: 'unagi_don', name: '장어덮밥', category: 'japanese', subcategory: 'rice_bowls' }
        ]
      },
      {
        id: 'fried',
        name: '튀김류',
        foods: [
          { id: 'tempura', name: '튀김(텐푸라)', category: 'japanese', subcategory: 'fried' },
          { id: 'tonkatsu', name: '돈까스', category: 'japanese', subcategory: 'fried' },
          { id: 'chicken_katsu', name: '치킨까스', category: 'japanese', subcategory: 'fried' },
          { id: 'ebi_fry', name: '새우튀김', category: 'japanese', subcategory: 'fried' }
        ]
      }
    ]
  },
  {
    id: 'western',
    name: '양식',
    emoji: '🍝',
    subcategories: [
      {
        id: 'pasta',
        name: '파스타',
        foods: [
          { id: 'spaghetti', name: '스파게티', category: 'western', subcategory: 'pasta' },
          { id: 'carbonara', name: '까르보나라', category: 'western', subcategory: 'pasta' },
          { id: 'bolognese', name: '볼로네제', category: 'western', subcategory: 'pasta' },
          { id: 'aglio_olio', name: '알리오올리오', category: 'western', subcategory: 'pasta' },
          { id: 'penne_arrabbiata', name: '펜네 아라비아타', category: 'western', subcategory: 'pasta' }
        ]
      },
      {
        id: 'pizza',
        name: '피자',
        foods: [
          { id: 'margherita', name: '마르게리타', category: 'western', subcategory: 'pizza' },
          { id: 'pepperoni', name: '페퍼로니', category: 'western', subcategory: 'pizza' },
          { id: 'hawaiian', name: '하와이안', category: 'western', subcategory: 'pizza' },
          { id: 'quattro_cheese', name: '콰트로치즈', category: 'western', subcategory: 'pizza' }
        ]
      },
      {
        id: 'steak',
        name: '스테이크',
        foods: [
          { id: 'ribeye', name: '립아이 스테이크', category: 'western', subcategory: 'steak' },
          { id: 'sirloin', name: '등심 스테이크', category: 'western', subcategory: 'steak' },
          { id: 'tenderloin', name: '안심 스테이크', category: 'western', subcategory: 'steak' },
          { id: 'tbone', name: '티본 스테이크', category: 'western', subcategory: 'steak' }
        ]
      },
      {
        id: 'other',
        name: '기타',
        foods: [
          { id: 'risotto', name: '리조또', category: 'western', subcategory: 'other' },
          { id: 'fish_chips', name: '피쉬앤칩스', category: 'western', subcategory: 'other' },
          { id: 'lasagna', name: '라자냐', category: 'western', subcategory: 'other' },
          { id: 'hamburg_steak', name: '함박스테이크', category: 'western', subcategory: 'other' }
        ]
      }
    ]
  },
  {
    id: 'asian',
    name: '아시안',
    emoji: '🍜',
    subcategories: [
      {
        id: 'thai',
        name: '태국음식',
        foods: [
          { id: 'pad_thai', name: '팟타이', category: 'asian', subcategory: 'thai' },
          { id: 'tom_yum', name: '똠얌꿍', category: 'asian', subcategory: 'thai' },
          { id: 'green_curry', name: '그린커리', category: 'asian', subcategory: 'thai' },
          { id: 'mango_sticky_rice', name: '망고 스티키라이스', category: 'asian', subcategory: 'thai' }
        ]
      },
      {
        id: 'vietnamese',
        name: '베트남음식',
        foods: [
          { id: 'pho', name: '쌀국수(퍼)', category: 'asian', subcategory: 'vietnamese' },
          { id: 'banh_mi', name: '반미', category: 'asian', subcategory: 'vietnamese' },
          { id: 'bun_bo_hue', name: '분보후에', category: 'asian', subcategory: 'vietnamese' }
        ]
      },
      {
        id: 'indian',
        name: '인도음식',
        foods: [
          { id: 'curry', name: '카레', category: 'asian', subcategory: 'indian' },
          { id: 'biryani', name: '비리야니', category: 'asian', subcategory: 'indian' },
          { id: 'naan', name: '난', category: 'asian', subcategory: 'indian' },
          { id: 'tandoori', name: '탄두리', category: 'asian', subcategory: 'indian' }
        ]
      }
    ]
  },
  {
    id: 'other',
    name: '기타',
    emoji: '🍽️',
    subcategories: [
      {
        id: 'fast_food',
        name: '패스트푸드',
        foods: [
          { id: 'burger', name: '햄버거', category: 'other', subcategory: 'fast_food' },
          { id: 'fried_chicken', name: '후라이드치킨', category: 'other', subcategory: 'fast_food' },
          { id: 'hot_dog', name: '핫도그', category: 'other', subcategory: 'fast_food' },
          { id: 'sandwich', name: '샌드위치', category: 'other', subcategory: 'fast_food' }
        ]
      },
      {
        id: 'cafe',
        name: '카페/디저트',
        foods: [
          { id: 'coffee', name: '커피', category: 'other', subcategory: 'cafe' },
          { id: 'cake', name: '케이크', category: 'other', subcategory: 'cafe' },
          { id: 'ice_cream', name: '아이스크림', category: 'other', subcategory: 'cafe' },
          { id: 'croissant', name: '크루아상', category: 'other', subcategory: 'cafe' }
        ]
      },
      {
        id: 'snacks',
        name: '분식',
        foods: [
          { id: 'tteokbokki', name: '떡볶이', category: 'other', subcategory: 'snacks' },
          { id: 'kimbap', name: '김밥', category: 'other', subcategory: 'snacks' },
          { id: 'sundae', name: '순대', category: 'other', subcategory: 'snacks' },
          { id: 'hotteok', name: '호떡', category: 'other', subcategory: 'snacks' }
        ]
      }
    ]
  }
];

// 음식 검색 유틸리티 함수들
export const getAllFoods = (): FoodItem[] => {
  return foodCategories.flatMap(category =>
    category.subcategories.flatMap(subcategory => subcategory.foods)
  );
};

export const searchFoods = (query: string): FoodItem[] => {
  const allFoods = getAllFoods();
  return allFoods.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const getFoodsByCategory = (categoryId: string): FoodItem[] => {
  const category = foodCategories.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return category.subcategories.flatMap(subcategory => subcategory.foods);
};

export const getFoodsBySubCategory = (categoryId: string, subcategoryId: string): FoodItem[] => {
  const category = foodCategories.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  if (!subcategory) return [];
  
  return subcategory.foods;
};