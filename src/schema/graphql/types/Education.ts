import { inputObjectType, objectType } from "nexus";
import { EducationService } from "../../../services";

export const EducationInputType = inputObjectType({
    name: 'EducationInput',
    definition(t) {
        t.nonNull.string('gpa')
        t.nonNull.string('institute')
        t.nonNull.string('course')
        t.nonNull.string('campus')
        t.nonNull.string('duration')
        t.nonNull.string('startDate')
        t.nonNull.string('endDate')
        t.nonNull.string('level')
    }
})

export const UpdateEducationInputType = inputObjectType({
    name: 'UpdateEducationInput',
    definition(t) {
        t.nullable.string('gpa')
        t.nullable.string('institute')
        t.nullable.string('course')
        t.nullable.string('campus')
        t.nullable.string('duration')
        t.nullable.string('startDate')
        t.nullable.string('endDate')
        t.nullable.string('level')
    }
})

export const EducationType = objectType({
    name: 'Education',
    definition(t) {
        t.nonNull.id('id')
        t.nonNull.string('gpa')
        t.nonNull.string('institute')
        t.nonNull.string('course')
        t.nonNull.string('campus')
        t.nonNull.string('duration')
        t.nonNull.string('startDate')
        t.nonNull.string('endDate')
        t.nonNull.string('level')
    },
});

export const EducationPageType = objectType({
    name: 'EducationPage',
    definition(t) {
        t.implements('PageInterface')
        t.nonNull.list.nonNull.field('list', {
            type: 'Education',
            resolve: async ({ userId }) => {
                const educations = await EducationService.getEducations(userId);
                if (!educations) return []
                return educations.map(education => ({
                    id: education.id.toString(),
                    campus: education.campus!,
                    course: education.course!,
                    duration: education.duration!,
                    endDate: education.endDate!,
                    gpa: education.gpa!,
                    institute: education.institute!,
                    startDate: education.startDate!,
                    level: education.level!
                }))
            }
        })
    },
});