window.onload = () => {
  var titleDisplay = document.querySelector('.js-title'),
    pointDisplay = document.querySelector('.js-pointpos'),
    dateDisplay = document.querySelector('.js-datetime'),
    editButton = document.querySelector('.js-edit'),
    doneButton = document.querySelector('.js-unedit'),
    editor = document.querySelector('.js-editor'),
    pointsList = document.querySelector('.js-points')
    meetingTitle = 'FSR vergadering',
    currentPoint = 1,
    noPoints = 'unkown',
    editorOpen = true,
    datetimeInterval = window.setInterval(updateDatetime, 30 * 1000);

  updateTitle();
  updatePoint();
  updateDatetime();
  editor.focus();

  document.addEventListener('keydown', keyHandler);
  editButton.addEventListener('click', openEditor);
  doneButton.addEventListener('click', closeEditor);

  function openEditor() {
    document.querySelector('.js-md').classList.remove('md-cont--closed');
    editorOpen = true;
    editor.focus();
  }

  function closeEditor() {
    document.querySelector('.js-md').classList.add('md-cont--closed');
    mdToPoints();
    editorOpen = false;
    editor.blur();
  }

  function updateTitle(title) {
    titleDisplay.textContent = title;
  }

  function updatePoint() {
    pointDisplay.textContent = currentPoint + ' of ' + noPoints;
  }

  function updateDatetime() {
    let currentDatetime = new Date(),
      displayOptions = {
        timeZone: 'Europe/Amsterdam',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    dateDisplay.textContent = currentDatetime.toLocaleString('en-GB', displayOptions);
  }

  function mdToPoints() {
    let md_content = editor.value,
      html_content = markdown.toHTML(md_content);
    pointsList.innerHTML = html_content;
    let h1 = pointsList.querySelector('h1');
    updateTitle(h1.textContent);
    h1.remove();
    noPoints = pointsList.children[0].children.length;
    updatePoint();
  }

  function keyHandler(event) {
    if (editorOpen) {
      if (event.keyCode === 27) {
        closeEditor();
      }
    } else {
      switch (event.keyCode) {
        case 37:
          event.preventDefault();
          moveSlide(-1);
          break;
        case 38:
          event.preventDefault();
          scrollSlide(-1);
          break;
        case 39:
          event.preventDefault();
          moveSlide(1);
          break;
        case 40:
          event.preventDefault();
          scrollSlide(1);
          break;
        case 69:
          event.preventDefault();
          openEditor();
          break;
      }
    }
  }

  function moveSlide(amount) {
    if (currentPoint + amount > 0 && currentPoint + amount < noPoints + 1) {
      let target = (currentPoint + amount - 1) * window.innerWidth;
      pointsList.scrollLeft = target;
      currentPoint = currentPoint + amount;
      updatePoint();
      scrollSlide(0, true);
    }
  }

  function scrollSlide(amount, top = false) {
    let target = pointsList.scrollTop + amount * window.innerHeight * .7;
    if (top) {
      target = 0;
    }
    pointsList.scrollTop = target;
  }
}
