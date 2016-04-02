var syncButton = document.getElementById('sync-button');
syncButton.addEventListener('click', function (e) {
  var username = document.getElementById('github-username').value;
  var spinner = document.getElementById('spinner');
  spinner.classList.remove('hidden');

  chrome.bookmarks.getSubTree('1', (node) => {
    let bookmarks = node[0].children;
    let bookmarksParent = node[0].id;
    let starsFolder = _.filter(bookmarks, { title: 'github-stars' });

    if (starsFolder.length === 0) {
      chrome.bookmarks.create({parentId: '1', title: 'github-stars'}, (node) => {
        downloadStars(node, username);
      });
    }
    else {
      downloadStars(starsFolder, username);
    }
  });

  e.stopPropagation();
  e.preventDefault();
});

function downloadStars(folder, username) {
  function download(page) {
    fetch(`https://api.github.com/users/${username}/starred?page=${page}`).then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
      if(json.length) {
        download(page + 1);
      }
      else {
        var spinner = document.getElementById('spinner');
        spinner.classList.add('hidden');
      }
    });
  }

  download(1);
}
