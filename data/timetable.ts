import { z } from 'zod';
import type { Schema } from 'zod';

import { ClassesSchema, Class } from './classes';
import { Period, PeriodsSchema } from './periods';
import { Day, DaysSchema } from './days';
import { EntriesSchema, Entry } from './entries';
import { Lesson, LessonsSchema } from './lessons';
import { Group, GroupsSchema } from './groups';
import { Division, DivisionsSchema } from './divisions';
import { Subject, SubjectsSchema } from './subjects';
import { Teacher, TeachersSchema } from './teachers';
import { Classroom, ClassroomsSchema } from './classrooms';

export const TimetableSchema = z.object({
    r: z.object({
        dbiAccessorRes: z.object({
            tables: z.array(z.any())
        })
    })
});
type TimetableJson = z.infer<typeof TimetableSchema>

function findBySchema<T extends Schema>(array: unknown[], schema: T): z.infer<T> {
    for(let e of array){
        let result = schema.safeParse(e);
        if (result.success){
            return result.data;
        }
    }
    throw new Error("No object matching the provided schema was found in the array");
}

export class Timetable {

    periods: Period[]
    classes: Class[]
    days: Day[]
    entires: Entry[]
    lessons: Lesson[]
    groups: Group[]
    divisions: Division[]
    subjects: Subject[]
    teachers: Teacher[]
    classrooms: Classroom[]

    constructor(json: TimetableJson){
        this.periods = findBySchema(json.r.dbiAccessorRes.tables,PeriodsSchema)
            .data_rows.map(e=>new Period(e));
        this.classes = findBySchema(json.r.dbiAccessorRes.tables,ClassesSchema)
            .data_rows.map(e=>new Class(e));
        this.days = findBySchema(json.r.dbiAccessorRes.tables,DaysSchema)
            .data_rows.map(e=>new Day(e));
        this.entires = findBySchema(json.r.dbiAccessorRes.tables,EntriesSchema)
            .data_rows.map(e=>new Entry(e));
        this.lessons = findBySchema(json.r.dbiAccessorRes.tables,LessonsSchema)
            .data_rows.map(e=>new Lesson(e));
        this.groups = findBySchema(json.r.dbiAccessorRes.tables,GroupsSchema)
            .data_rows.map(e=>new Group(e));
        this.divisions = findBySchema(json.r.dbiAccessorRes.tables,DivisionsSchema)
            .data_rows.map(e=>new Division(e));
        this.subjects = findBySchema(json.r.dbiAccessorRes.tables,SubjectsSchema)
            .data_rows.map(e=>new Subject(e));
        this.teachers = findBySchema(json.r.dbiAccessorRes.tables,TeachersSchema)
            .data_rows.map(e=>new Teacher(e));
        this.classrooms = findBySchema(json.r.dbiAccessorRes.tables,ClassroomsSchema)
            .data_rows.map(e=>new Classroom(e));
    }
}