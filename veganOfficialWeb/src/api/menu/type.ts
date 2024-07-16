type MenuRes = string[];

type Ingredient = string;

interface MenuItem {
    name: string;
    description: string;
    ingredients: Ingredient[];
    price: number;
    category: string;
    fileName: string;
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