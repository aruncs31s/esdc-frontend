import { ReactNode } from 'react';
import Header from './Navbar';
import Footer from './Footer';

interface Props {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const MainLayout = ({ children, showHeader = true, showFooter = true }: Props) => {
  return (
    <>
      {showHeader && <Header />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
};
