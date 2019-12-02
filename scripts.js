// Lyric Info 

let songList = {
1: "So I say Dance for me, dance for me, dance for me, oh, oh, oh I've never seen anybody do the things you do before They say move for me, move for me, move for me, ay, ay, ay And when you're done I'll make you do it all again".split(', '),
2: "Guess who's back, back again. Shady's back, tell a friend. Guess who's back, guess who's back? Guess who's back, guess who's back? Guess who's back, guess who's back? Guess who's back?".split(', ')
};

// Initial Redux State

const initialState = {
    currentSongId: null,
    songsById: {
        1:{
            title: "Dance Monkey",
            artist: "Tones and I",
            songId: 1,
            songArray: songList[1],
            arrayPosition: 0,
        },
        2: {
            title: "Guess Whos Back",
            artist: "Eminem",
            songId: 2,
            songArray: songList[2],
            arrayPosition: 0,

        }
    }

};

// REDUX REDUCERS
const lyricChangeReducer = (state = initialState.songsById, action) => {
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;
  switch (action.type) {
    case 'NEXT_LYRIC':
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      return newSongsByIdStateSlice;
    case 'RESTART_SONG':
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      return newSongsByIdStateSlice;
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
      return state;
  }
}
  
  const rootReducer = this.Redux.combineReducers({
    currentSongId: songChangeReducer,
    songsById: lyricChangeReducer
  });
  
  // REDUX STORE
  const { createStore } = Redux;
  const store = createStore(rootReducer);
  
  // JEST TESTS + SETUP
  const { expect } = window;
  
  expect(lyricChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);
  
  expect(lyricChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
    1:{
        title: "Dance Monkey",
        artist: "Tones and I",
        songId: 1,
        songArray: songList[1],
        arrayPosition: 0,
    },

    2: {
        title: "Guess Whos Back",
        artist: "Eminem",
        songId: 2,
        songArray: songList[2],
        arrayPosition: 1,

    }
  });
  
  expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
    1:{
        title: "Dance Monkey",
        artist: "Tones and I",
        songId: 1,
        songArray: songList[1],
        arrayPosition: 0,
    },

    2: {
        title: "Guess Whos Back",
        artist: "Eminem",
        songId: 2,
        songArray: songList[2],
        arrayPosition: 0,

    }
  });
  
  expect(songChangeReducer(initialState, { type: null })).toEqual(initialState);
  
  expect(songChangeReducer(initialState, { type: 'CHANGE_SONG', newSelectedSongId: 1 })).toEqual(1);
  
  expect(rootReducer(initialState, { type: null })).toEqual(initialState);
  
  expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));
  
  expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));
  
  // RENDERING STATE IN DOM
  const renderLyrics = () => {
    const lyricsDisplay = document.getElementById('lyrics');
    while (lyricsDisplay.firstChild) {
      lyricsDisplay.removeChild(lyricsDisplay.firstChild);
    }
  
    if (store.getState().currentSongId) {
      const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
      document.getElementById('lyrics').appendChild(currentLine);
    } else {
      const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
      document.getElementById('lyrics').appendChild(selectSongMessage);
    }
  }
  
  const renderSongs = () => {
    const songsById = store.getState().songsById;
    for (const songKey in songsById) {
      const song = songsById[songKey]
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const em = document.createElement('em');
      const songTitle = document.createTextNode(song.title);
      const songArtist = document.createTextNode(' by ' + song.artist);
      em.appendChild(songTitle);
      h3.appendChild(em);
      h3.appendChild(songArtist);
      h3.addEventListener('click', function() {
        selectSong(song.songId);
      });
      li.appendChild(h3);
      document.getElementById('songs').appendChild(li);
    }
  }
  
  window.onload = function() {
    renderSongs();
    renderLyrics();
  }
  
  // CLICK LISTENERS
  const userClick = () => {
    if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].songArray.length - 1) {
      store.dispatch({ type: 'RESTART_SONG',
                       currentSongId: store.getState().currentSongId });
    } else {
      store.dispatch({ type: 'NEXT_LYRIC',
                       currentSongId: store.getState().currentSongId });
    }
  }
  
  const selectSong = (newSongId) => {
    let action;
    if (store.getState().currentSongId) {
      action = {
        type: 'RESTART_SONG',
        currentSongId: store.getState().currentSongId
      }
      store.dispatch(action);
    }
    action = {
      type: 'CHANGE_SONG',
      newSelectedSongId: newSongId
    }
    store.dispatch(action);
  }
  
  // SUBSCRIBE TO REDUX STORE
  store.subscribe(renderLyrics);
