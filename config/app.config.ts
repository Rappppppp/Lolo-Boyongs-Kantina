export interface AppConfig {
  name: string;
  description: string;
  version: string;
  author: string;
  company?: string;

  address: string;
  phone: string;
  email: string;

  urls: {
    baseUrl: string;
    apiUrl: string;
    docsUrl?: string;
  };

  branding: {
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor?: string;
  };

  features: {
    enableAuth: boolean;
    enableAnalytics: boolean;
    enableMaintenanceMode: boolean;
  };
}

export const appConfig: AppConfig = {
  name: "Lolo Boyong's Kantina",
  description: "Lolo Boyong's Kantina was founded in 2019 by husband-and-wife team Mr. Richmond and Mrs. Joan Bonza. Named in honor of Mr. Richmond’s beloved grandfather, “Lolo Boyong”, the restaurant stands as a tribute to family, tradition, and good food.",
  version: "1.0.0",
  author: "Aro",

  address: " Poblacion 3, Mabini Street, Sta. Cruz Laguna (Near Aglipay Church)",
  phone: "0939-829-2110",
  email: "loloboyong01@gmail.com",

  urls: {
    baseUrl: "https://myrestaurant.com",
    apiUrl: "https://api.myrestaurant.com/v1",
    docsUrl: "https://docs.myrestaurant.com",
  },

  branding: {
    logo: "/assets/logo.png",
    favicon: "/favicon.ico",
    primaryColor: "#C62828",
    secondaryColor: "#FFEBEE",
  },

  features: {
    enableAuth: true,
    enableAnalytics: true,
    enableMaintenanceMode: false,
  },
};
