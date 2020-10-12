import { Lesson } from './../model/lesson';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from 'app/model/course';
import { map, shareReplay, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  baseUrl = 'api/courses';

  constructor(private http: HttpClient) {}

  loadCourseById(courseId: number) {
   return this.http.get<Course>(`${this.baseUrl}/${courseId}`).pipe(shareReplay());
  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
    return this.http
    .get<Lesson[]>('/api/lessons', {
      params: {
        pageSize: '10000',
        courseId: courseId.toString()
      },
    })
    .pipe(map((res) => res['payload'], shareReplay()));
  }

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl).pipe(
      map((res) => res['payload']),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>('/api/lessons', {
        params: {
          filter: search,
          pageSize: '100',
        },
      })
      .pipe(map((res) => res['payload'], shareReplay()));
  }
}
