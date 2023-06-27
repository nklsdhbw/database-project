//* import libraries *//
import React from "react";
import { Button } from "react-bootstrap";
//* import css *//

function SearchAttributes(props) {
  const {
    showSearchBookButton,
    showSearchAuthorButton,
    showSearchManagerButton,
    showSearchZipButton,
    showSearchCurrencyButton,
    showSearchTeamButton,
    showSearchEmployeeButton,
    showSearchReaderButton,
    hidePublisherButton,
    setshowSearch,
    showSearch,
  } = props;
  function handlePublisher() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Publishers");
  }
  function handleZip() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "ZIPs");
  }

  function handleBook() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Books");
  }
  function handleAuthor() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Authors");
  }

  function handleManager() {
    sessionStorage.setItem("searchTable", "Managers");
    setshowSearch(!showSearch);
  }
  function handleCurrency() {
    sessionStorage.setItem("searchTable", "Currencies");
    setshowSearch(!showSearch);
  }
  function handleTeam() {
    sessionStorage.setItem("searchTable", "Teams");
    setshowSearch(!showSearch);
  }
  function handleEmployee() {
    sessionStorage.setItem("searchTable", "Employees");
    setshowSearch(!showSearch);
  }
  function handleReader() {
    sessionStorage.setItem("searchTable", "Readers");
    setshowSearch(!showSearch);
  }

  return (
    <>
      {showSearchBookButton && (
        <Button onClick={handleBook}>Search Book</Button>
      )}
      {showSearchAuthorButton && (
        <Button onClick={handleAuthor}>Search Author</Button>
      )}
      {showSearchManagerButton && (
        <Button onClick={handleManager}>Search Manager</Button>
      )}
      {showSearchZipButton && <Button onClick={handleZip}>Search Zip</Button>}
      {showSearchCurrencyButton && (
        <Button onClick={handleCurrency}>Search Currency</Button>
      )}
      {showSearchTeamButton && (
        <Button onClick={handleTeam}>Search Team</Button>
      )}
      {showSearchEmployeeButton && (
        <Button onClick={handleEmployee}>Search Employee</Button>
      )}
      {showSearchReaderButton && (
        <Button onClick={handleReader}>Search Reader</Button>
      )}
      <Button hidden={hidePublisherButton} onClick={handlePublisher}>
        Search Publisher
      </Button>
    </>
  );
}

export default SearchAttributes;
