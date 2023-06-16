//* import images *//
import chapterOneLogo from "../img/logo.svg";

//* import css *//
import "../css/Header.css";

const Header = () => {
  return (
    <header>
      <div className="logo-container">
        <img src={chapterOneLogo} alt="ChapterOne Logo" />
      </div>
    </header>
  );
};

export default Header;
