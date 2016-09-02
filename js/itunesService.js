angular.module('itunes').service('itunesService', function($http, $q){
  //This service is what will do the 'heavy lifting' and get our data from the iTunes API.
  //Also note that we're using a 'service' and not a 'factory' so all your methods you want to call in your controller need to be on 'this'.

  //Write a method that accepts an artist's name as the parameter, then makes a 'JSONP' http request to a url that looks like this
  //https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK'
  //Note that in the above line, artist is the parameter being passed in.
  //You can return the http request or you can make your own promise in order to manipulate the data before you resolve it.
  this.urlBuilder = function(term, media, limit, explicit) {
    return 'https://itunes.apple.com/search?term=' + term + '&media=' + media + '&limit=' + limit + '&explicit=' + explicit + '&callback=JSON_CALLBACK'
  }

    //Code here
    this.getArtistInfo = function(term, mediatype, limit, explicit){
      var url = this.urlBuilder(term,mediatype,limit,explicit);

      var deferred = $q.defer();
      $http({
        method: 'JSONP',
        url: url
      }).then(function(response){
        var songData = response.data.results;
        var formattedSongData = [];
        for (var song in songData){
          formattedSongData.push(
            {
              AlbumArt: songData[song]['artworkUrl100'],
              Artist: songData[song]['artistName'],
              Song: songData[song]['trackName'],
              Collection: songData[song]['collectionName'],
              CollectionPrice: songData[song]['collectionPrice'],
              Play: songData[song]['previewUrl'],
              Genre: songData[song]['primaryGenreName'],
              trackLength: songData[song]['trackTimeMillis'] ? Math.floor(songData[song]['trackTimeMillis']/1000/60) + ':' + ('00' + Math.ceil((songData[song]['trackTimeMillis']/1000) % 60)).slice(-2) : '--:--'
            }
          )
        }

        deferred.resolve(formattedSongData)
      })

      return deferred.promise;
    }




});
