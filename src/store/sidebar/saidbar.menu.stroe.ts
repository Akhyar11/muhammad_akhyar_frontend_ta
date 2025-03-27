export interface MenuItems {
  label: string;
  route: string;
  icon?: React.JSX.Element;
  childres?: {
    label: string;
    route: "/";
  }[];
}

export const initialState: MenuItems[] = [
  {
    label: "Dashboard",
    route: "/",
  },
  {
    label: "BMI Intelligence (BETA)",
    route: "/bmiintelligence",
  },
  {
    label: "Riwayat",
    route: "/riwayat",
  },
  {
    label: "Settings Is Maintenance",
    route: "/not-found",
  },
];
