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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, priority, status, deadline, assignedToId, tags } = input;

      const task = await ctx.db.task.create({
        data: {
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
        },
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
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      return task;
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, description, priority, status, deadline, assignedToId, tags } = input;

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
