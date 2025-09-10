"use server"
import { mutation, query } from "./_generated/server";
import {v} from 'convex/values'
export const CreateWorkspace = mutation({
    args: {
        messages: v.any(),
        user: v.optional(v.id('users')),
        fileData: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        // Get user from context if not provided
        let userId = args.user;
        console.log('Creating workspace for user:', userId);
        if (!userId && ctx.user) {
            const user = await ctx.db.query('users')
                .filter(q => q.eq(q.field('email'), ctx.user.email))
                .first();
            userId = user?._id;
        }
        
        if (!userId) {
            
            console.warn('User not authenticated - redirecting to sign in');
            return null;
        }
        
        if (typeof userId !== 'string' || !/^[a-zA-Z0-9]+$/.test(userId)) {
            throw new Error('Invalid user ID format');
        }

        const workspaceId = await ctx.db.insert('workspace', {
            messages: args.messages,
            user: userId,
            fileData: args.fileData
        });

        
        console.log('Created workspace with ID:', workspaceId);
        if (!workspaceId) {
            console.error('Failed to create workspace - no ID returned');
            throw new Error('Failed to create workspace');
        }
        return workspaceId;
    }
})




export const GetWorkspace = query({
    args: {
        workspaceId: v.id('workspace')
    },
    handler: async (ctx, args) => {
        // Convert to string if needed and validate
        const workspaceId = args.workspaceId?.toString();
        if (!workspaceId) {
            throw new Error('Workspace ID is required');
        }
        
        // Verify ID format matches expected pattern

        const workspace = await ctx.db.get(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }
        return workspace;
    }
})


export const UpdateMessages = mutation({
    args : {
        workspaceId: v.id('workspace'),
        messages: v.any()
    },
    handler : async (ctx,args) => {
        const result = await ctx.db.patch(args.workspaceId, {
            messages:args.messages,
        });

        return result;
    }
}) 
export const UpdateFiles = mutation({
    args : {
        workspaceId: v.id('workspace'),
        fileData: v.optional(v.any())
    },
    handler : async (ctx,args) => {
        const result = await ctx.db.patch(args.workspaceId, {
            fileData: args.fileData || null
        });

        return result;
    }
})


export const GetAllWorkspace =  query({
    args: {
        userId : v.id('users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('workspace').filter(q => q.eq(q.field('user'),args.userId)).collect();

        return result;
    }
})