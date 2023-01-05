import { inputObjectType, list, nonNull, objectType } from "nexus"
import { ExperienceService } from "../../../services"

// Object Types
export const WorkType = objectType({
    name: 'Work',
    definition(t){
        t.nonNull.id('id'),
        t.nullable.string('icon'),
        t.nonNull.string('company')
        t.nonNull.string('role')
        t.nonNull.string('duration')
        t.nonNull.string('type')
        t.nonNull.string('address')
        t.nonNull.list.nonNull.string('duties')
    }
})

export const ProjectType = objectType({
    name: 'Project',
    definition(t){
        t.nonNull.id('id'),
        t.nonNull.list.nonNull.string('images')
        t.nullable.string('label'),
        t.nonNull.list.nonNull.string('skills')
        t.nonNull.string('desc')
        t.nonNull.string('github')
        t.nonNull.string('deployed')
    }
})

// Input Types

export const WorkInputType = inputObjectType({
    name: 'WorkInput',
    definition(t) {
        t.nullable.string('icon'),
        t.nonNull.string('company')
        t.nonNull.string('role')
        t.nonNull.string('duration')
        t.nonNull.string('type')
        t.nonNull.string('address')
        t.nonNull.list.nonNull.string('duties')
    }
})
export const UpdateWorkInputType = inputObjectType({
    name: 'UpdateWorkInput',
    definition(t) {
        t.nullable.string('icon'),
        t.nullable.string('company')
        t.nullable.string('role')
        t.nullable.string('duration')
        t.nullable.string('type')
        t.nullable.string('address')
        t.nullable.list.nonNull.string('duties')
    }
})
export const ProjectInputType = inputObjectType({
    name: 'ProjectInput',
    definition(t) {
        t.nonNull.list.nonNull.string('images')
        t.nullable.string('label'),
        t.nonNull.list.nonNull.string('skills')
        t.nonNull.string('desc')
        t.nonNull.string('github')
        t.nonNull.string('deployed')
    }
})
export const UpdateProjectInputType = inputObjectType({
    name: 'UpdateProjectInput',
    definition(t) {
        t.nullable.list.nonNull.string('images')
        t.nullable.string('label'),
        t.nullable.list.nonNull.string('skills')
        t.nullable.string('desc')
        t.nullable.string('github')
        t.nullable.string('deployed')
    }
})

// Resolver

export const ExperienceType = objectType({
    name: 'Experience',
    definition(t) {
        t.implements('PageInterface');
        t.nullable.field('works', {
            type: nonNull(list('Work')),
            resolve: async ({ userId }) => {
                const works = await ExperienceService.getWorks(userId);
                if (!works) return [];
                return works.map(work => ({
                    id: work.id.toString(),
                    address: work.address!,
                    company: work.company!,
                    duration: work.duration!,
                    duties: work.duties!,
                    role: work.role!,
                    type: work.type!,
                    icon: work.icon
                }))   
            }
        })
        t.nullable.field('projects', {
            type: nonNull(list('Project')),
            resolve: async ({ userId }) => {
                const projects = await ExperienceService.getProjects(userId);
                if (!projects) return [];
                return projects.map(project => ({
                    id: project.id.toString(),
                    deployed: project.deployed!,
                    desc: project.desc!,
                    github: project.github!,
                    images: project.images!,
                    skills: project.skills!,
                    label: project.label!
                }))
            }
        })
    }
});


