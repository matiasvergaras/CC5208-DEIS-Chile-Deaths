

function onChangeSelectors(checkbox) {
    var checkboxes = document.getElementsByName("selectors");
    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });
  }




