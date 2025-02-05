import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  // Create a new task
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Task title is required"),
        description: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
        deadline: z.date().optional(),
        assignedToId: z.string().optional(), // Optional assignee
        tags: z.array(z.string()).optional(), // Array of tag IDs
        projectId: z.string().optional(), // Optional project ID
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, priority, status, deadline, assignedToId, tags, projectId } = input;

      const taskData: any = {
        title,
        description,
        priority,
        status,
        deadline,
        createdBy: { connect: { id: ctx.session.user.id } },
        assignedTo: assignedToId ? { connect: { id: assignedToId } } : undefined,
        tags: tags
          ? {
              create: tags.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      };

      // Conditionally add the project field if projectId is provided
      if (projectId) {
        taskData.project = { connect: { id: projectId } };
      }

      const task = await ctx.db.task.create({
        data: taskData,
      });

      return task;
    }),

  // Get all tasks for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.db.task.findMany({
      where: {
        OR: [
          { createdById: ctx.session.user.id },
          { assignedToId: ctx.session.user.id },
        ],
      },
      include: {
        createdBy: true,
        assignedTo: true,
        tags: { include: { tag: true } },
        comments: true,
        project: true, // Include project details
      },
      orderBy: { createdAt: "desc" },
    });

    return tasks;
  }),

  // Get a single task by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: {
          createdBy: true,
          assignedTo: true,
          tags: { include: { tag: true } },
          comments: { include: { createdBy: true } },
          project: true, // Include project details
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      return task;
    }),
    
  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.db.task.findMany({
        where: { projectId: input.projectId },
        include: {
          createdBy: true,
          assignedTo: true,
          tags: { include: { tag: true } },
          comments: { include: { createdBy: true } },
          project: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return tasks;
    }),

  // Update a task
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
        deadline: z.date().optional(),
        assignedToId: z.string().optional(),
        tags: z.array(z.string()).optional(),
        projectId: z.string().optional(), // Optional projectId for updating
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, description, priority, status, deadline, assignedToId, tags, projectId } = input;

      const updatedTask = await ctx.db.task.update({
        where: { id },
        data: {
          title,
          description,
          priority,
          status,
          deadline,
          assignedTo: assignedToId ? { connect: { id: assignedToId } } : undefined,
          tags: tags
            ? {
                create: tags.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
          project: projectId ? { connect: { id: projectId } } : undefined, // Update the project if provided
        },
      });

      return updatedTask;
    }),

  // Delete a task
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.delete({
        where: { id: input.id },
      });

      return { success: true, message: "Task deleted successfully" };
    }),
});
