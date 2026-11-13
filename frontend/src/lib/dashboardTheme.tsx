import { createContext, useContext } from 'react';

type DashboardThemeContextValue = {
  setPrimaryColor: (color: string | null) => void;
};

export const DashboardThemeContext = createContext<DashboardThemeContextValue>({
  setPrimaryColor: () => {},
});

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
