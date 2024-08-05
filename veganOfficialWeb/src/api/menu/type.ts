type MenuRes = string[];

type Ingredient = string;

interface MenuItem {
    name: string | null;
    description: string | null;
    ingredients: Ingredient[];
    price: number | null;
    category: string | null;
    fileName: string | null;
    rating: number | null;
    date: string | null;
    [key: string]: any;
}

interface MenuCategory {
    name: string;
    items: MenuItem[];
}

interface MenuQueryResponse {
    data: {
        menu: MenuCategory[];
    };
}

export type {
    MenuRes,
    MenuItem,
    MenuCategory,
    MenuQueryResponse
};