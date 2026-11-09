import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //Specifically, update the URI according to the base URL for express and the endpoint.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    return this.sendRequestToExpress(
      `/search/${category}/${encodeURIComponent(resource)}`
    ).then((data) => {
      // console.log(data);
      let items = data[category + 's'].items;

      return items.map((item: any) => {
        switch (category) {
          case 'artist': return new ArtistData(item);
          case 'album': return new AlbumData(item);
          case 'track': return new TrackData(item);
          default: throw new Error(`Invalid Category: ${category}`)
        }
      });
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => {
      // console.log(data);
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {
      // console.log(data);
      let tracks = data["tracks"];
      // console.log(tracks);

      return tracks.map((item: any) => {
        return new TrackData(item);
      })
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-albums/' + artistId).then((data) => {
      let items = data["items"];
      // console.log(data);
      return items.map((item: any) => {
        return new AlbumData(item);
      })
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    return this.sendRequestToExpress(`/album/${albumId}`).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress(`/album-tracks/${albumId}`).then((data) => {
      return data.items.map((track: any) => new TrackData(track));
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress('/track/' + trackId).then((data) => {
      console.log(data);
      return new TrackData(data);
    })
  }
}