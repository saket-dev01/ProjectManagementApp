import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  // Create a new project
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().optional(),
        members: z.array(z.string()).optional(), // Array of user IDs
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, members } = input;
      const project = await ctx.db.project.create({
        data: {
          name,
          description,
          createdBy: { connect: { id: ctx.session.user.id } },
          members: members
            ? { connect: members.map((id) => ({ id })) }
            : undefined,
        },
      });
      return project;
    }),

  addMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email("Invalid email format"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, email } = input;

      // Find the user by email
      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Add the user to the project
      const updatedProject = await ctx.db.project.update({
        where: { id: projectId },
        data: {
          members: { connect: { id: user.id } },
        },
      });

      return updatedProject;
    }),

  // Get all projects
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      include: {
        members: true,
        tasks: true,
      },
    });
    return projects;
  }),

  // Get a single project by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          members: true,
          tasks: {
            include: {
              comments: true,
              tags: { include: { tag: true } },
            },
          },
        },
      });
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    }),

  // Update a project
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        members: z.array(z.string()).optional(), // Array of user IDs
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description, members } = input;
      const updatedProject = await ctx.db.project.update({
        where: { id },
        data: {
          name,
          description,
          members: members
            ? {
                set: members.map((userId) => ({ id: userId })),
              }
            : undefined,
        },
      });
      return updatedProject;
    }),

  // Delete a project
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.project.delete({
        where: { id: input.id },
      });
      return { success: true, message: "Project deleted successfully" };
    }),
});
