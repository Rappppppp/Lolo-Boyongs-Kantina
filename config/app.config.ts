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
  description: "A modern restaurant reservation and ordering platform.",
  version: "1.0.0",
  author: "Aro",

  address: "1134 A. Mabini St, Poblacion III, Santa Cruz, 4009 Laguna, Philippines",
  phone: "555-555-5555",
  email: "aro@myrestaurant.com",

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
