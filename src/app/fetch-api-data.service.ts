import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
/**
 * reactive programming library for JavaScript,
 * and is used to combine multiple functions into a single function
 */
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myfilx-movies-9cb7e129c91a.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  /**
   * This will provide HttpClient to the entire class, making it available via this.http
   * @param http - Inject the HttpClient module to the constructor params
   */
  constructor(private http: HttpClient) {}

  /**
   * Making the api call for the user registration endpoint
   * Observable allows to process events asynchronously
   * pipe() takes the functions to combine,
   * @param userDetails - Details of the user to be registered.
   * @returns an observable of registration result
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Making the api call for the user login endpoint.
   * @param userDetails - user details to login.
   * @returns An observable with login result.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all movies.
   * @returns An observable with all movies.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   *  Making the api call for the Get One Movie endpoint.
   * @param title - The title of the movie.
   * @returns An observable with the movie details.
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for the Get the director endpoint.
   * @param directorName - The name of the director.
   * @returns An observable with the director details.
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for the Get Genre endpoint.
   * @param genreName - The name of the genre.
   * @returns An observable of the genre data.
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genres/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for the Get User endpoint.
   * @returns An observable of the user details.
   */
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return of(user);
  }

  /**
   * Making the api call for the get favorite movies for a user endpoint.
   * @param username - The username of the user.
   * @returns An observable of the user's favorite movies.
   */
  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   *  Making the api call to Add a Movie to favorite movies endpoint.
   * @param movie - The movie to add.
   * @returns An observable with a response that the movie has been added.
   */
  addFavoriteMovies(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .post(apiUrl + 'users/' + user.Name + '/movies/' + movie._id, null, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call to edit user
   * @param userDetails - The updated user details.
   * @returns An observable with the updated user details.
   */
  editUser(userDetails: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.Name, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call to delete the user
   * @returns An observable with a response after deleting the user.
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user.Name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making an API call to Delete a movie from a user's favorite movies list.
   * @param movie - movie to be removed.
   * @returns An observable with the response after deleting the movie from favorites.
   */
  deleteFavoriteMovies(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('in fetch api service: ', movie._id);
    return this.http
      .delete(apiUrl + 'users/' + user.Name + '/movies/' + movie._id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Non-typed response extraction from HTTP response.
   * @param res - The HTTP response.
   * @returns Extracted response data.
   */
  private extractResponseData(res: object): any {
    const body = res;
    return body || {}; // Return the response body or an empty object
  }

  /**
   * Handles HTTP errors.
   * @param error - The HTTP error response.
   * @returns An observable with an error message.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error occurred:', error.error.message);
    } else {
      console.error(
        `Server-side error Status code ${error.status},` +
          `Error body is: ${JSON.stringify(error.error)}`
      ); // without JSON.stringify you get [object object] error
    }
    return throwError('Something bad happened; please try again later.');
  }
}
