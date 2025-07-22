## website to get calories
https://www.fatsecret.co.nz/calories-nutrition/search?q=large%20fries

https://excalidraw.com/#json=EW9luAZ7e9D4VEuyxjv52,_Dr_5PkVjuKfUJfWqpvxiw

 <nav className="navbar">
        <a href="#" className="navbar-logo" onClick={() => handleNavLinkClick("/")}>
          Fuel & Fire
        </a>

        <div className={`hamburger-menu ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
          <div className="hamburger-bar"></div>
        </div>

        {/* Desktop Nav */}
        <ul className="nav-links">
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/")}>Home</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/calculator")}>Calculator</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/met")}>Met Table</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/intro")}>About</a></li>
          <li className="nav-link"><a href="#" onClick={() => handleNavLinkClick("/social")}>Social</a></li>
        </ul>

        {/* Mobile Nav */}
        <ul className={`mobile-nav-links ${isMenuOpen ? "active" : ""}`}>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/")}>Home</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/calculator")}>Calculator</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/met")}>Met Table</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/intro")}>About</a></li>
          <li className="mobile-nav-link"><a href="#" onClick={() => handleNavLinkClick("/social")}>Social</a></li>
        </ul>
      </nav>