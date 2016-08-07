(function () {
    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    var selectSong = false; 
    var dance;
    var energy;
    var key;
    var loudness;
    var mode;
    var speechiness;
    var acousticness;
    var instrumentalness;
    var liveness;
    var valence;
    var tempo;
    var time_signature;
    var artistDataID;
    var templateSource = document.getElementById('results-template').innerHTML,
  template = Handlebars.compile(templateSource),
  resultsPlaceholder = document.getElementById('results'),
  playingCssClass = 'playing',
  audioObject = null;
   var templateSource4 = document.getElementById('resultsArtist-template').innerHTML;  
    var template4 = Handlebars.compile(templateSource4); 
    var templateSource2 = document.getElementById('genreExplorer-template').innerHTML;
    var template2 = Handlebars.compile(templateSource2);
    var resultsPlaceholder2 = document.getElementById('genreExplorer');
    var templateSource3 = document.getElementById('getsongs-template').innerHTML;
    var template3 = Handlebars.compile(templateSource3);
    var newSongsPlaceholder = document.getElementById('newSongs');
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }
    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');
    var oauthSource = document.getElementById('oauth-template').innerHTML,
        oauthTemplate = Handlebars.compile(oauthSource),
        oauthPlaceholder = document.getElementById('oauth');
    var params = getHashParams();
    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;
    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
                access_token: access_token,
                refresh_token: refresh_token
            });
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                    $('#login').hide();
                    $('#select').show();
                    $('#important').hide();
                }
            });
        } else {
            // render initial screen
            $('#login').show();
            $('#select').hide();
            $('#important').hide();
        }
      
    }
    var getSongFeatures = function (id) {
        $.ajax({
            url: 'https://api.spotify.com/v1/audio-features/' + id,
            async: false,
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                dance = response.danceability;
                energy = response.energy;
                key = response.key;
                loudness = response.loudness;
                mode = response.mode;
                speechiness = response.speechiness;
                acousticness = response.acousticness;
                instrumentalness = response.instrumentalness;
                liveness = response.liveness;
                valence = response.valence;
                tempo = response.tempo;
                time_signature = response.time_signature;
            }
        });
    }
    var getArtistFeatures = function (id) {
        $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + id + '/top-tracks',
            async: false,
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {
                country: 'US'
            },
            success: function (response) {
                getSongFeatures(response.tracks[0].id);

                var _dance = dance;
                var _energy = energy;
                var _key = key;
                var _loudness = loudness;
                var _mode = mode;
                var _speechiness = speechiness;
                var _acousticness = acousticness;
                var _instrumentalness = instrumentalness;
                var _liveness = liveness;
                var _valence = valence;
                var _tempo = tempo;
                var _time_signature = time_signature;

                for (i = 1; i < response.tracks.length; i++) {
                    getSongFeatures(response.tracks[i].id); 
                    _dance += dance; 
                    _energy += energy; 
                    
                    _loudness += loudness; 
                   
                    _speechiness += speechiness;
                    _acousticness += acousticness; 
                    _instrumentalness += instrumentalness; 
                    _liveness += liveness; 
                    _valence += valence; 
                    _tempo += tempo; 
                    _time_signature += time_signature; 
                }
                dance = _dance/response.tracks.length; 
                energy = _energy/response.tracks.length; 
                loudness = _loudness / response.tracks.length;
                key = _key;
                mode = _mode;
                speechiness = _speechiness/response.tracks.length; 
                acousticness = _acousticness/response.tracks.length; 
                instrumentalness = _instrumentalness/response.tracks.length; 
                liveness = _liveness/response.tracks.length; 
                valence = _valence/response.tracks.length; 
                tempo = _tempo/response.tracks.length; 
                
            }
            })
        };
    var searchTracks = function (query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'track'
            },
            success: function (response) {
                resultsPlaceholder.innerHTML = template(response);
            }
        })
    };
    var searchArtists = function (query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'artist'
            },
            success: function (response) {
                resultsPlaceholder.innerHTML = template4(response);

            }
        })
    };


    var getNewTracks = function (a, d, e, i, k, li, lo, m, s, te, ti, v, gs) {
        $.ajax({
            url: 'https://api.spotify.com/v1/recommendations',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {
                seed_genres: gs,
                target_acousticness: a,
                target_danceability: d,
                target_energy: e,
                target_instrumentalness: i,
                target_key: k,
                target_liveness: li,
                target_loudness: lo,
                target_mode: m,
                target_speechiness: s,
                target_tempo: te,
                target_time_signature: ti,
                target_valence: v

            },
            success: function (response) {
                newSongsPlaceholder.innerHTML = template3(response);
            },
            error: function (xhr, response, textStatus, thrownError) {
z            }
        });
    }
    document.getElementById("songMode").addEventListener('click',function(){
        $('#important').show();
        selectSong=true;
        document.getElementById("song/artist").innerHTML="Enter a song that you like:";
    });
    document.getElementById("artistMode").addEventListener('click', function(){
        $('#important').show();
        selectSong=false;
        document.getElementById("song/artist").innerHTML="Enter an artist that you like:";
    });
    results.addEventListener('click', function (e) {

        var target = e.target;

        if (selectSong === true) {
            var songData = { title: target.getAttribute("songid"), artist: target.getAttribute("artistname") };
            resultsPlaceholder2.innerHTML = template2(songData);
            document.getElementById('getSongs').addEventListener('click', function () {
            getSongFeatures(songID);
            getNewTracks(acousticness, dance, energy, instrumentalness, key, liveness, loudness, mode, speechiness, tempo, time_signature, valence, document.getElementById("genre").value.toString());
            }, false);
            var songID = target.getAttribute("song-data-id");
            window.songID = songID;
            artistDataID = target.getAttribute("artistid");
            window.artistDataID = artistDataID;
        } else {
            artistDataID = target.getAttribute("artist-data-id");
            window.artistDataID = artistDataID;
            var songData = { title: target.getAttribute("songid"), artist: target.getAttribute("artistname") };
            resultsPlaceholder2.innerHTML = template2(songData);
            document.getElementById('getSongs').addEventListener('click', function () {
            getArtistFeatures(artistDataID);
            getNewTracks(acousticness, dance, energy, instrumentalness, key, liveness, loudness, mode, speechiness, tempo, time_signature, valence, document.getElementById("genre").value.toString());
            }, false);
            var songID = target.getAttribute("song-data-id");
            window.songID = songID;
        };  

    });

    document.getElementById('search').addEventListener('click', function (e) {
        e.preventDefault();
        if (selectSong === true) {
            searchTracks(document.getElementById('songtext').value.toString());
        } else {
            searchArtists(document.getElementById('songtext').value.toString());
        }
        $("#search").hide();
    }, false);

})();
