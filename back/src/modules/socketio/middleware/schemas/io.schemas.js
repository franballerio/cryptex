import { z } from 'zod';

export const schemas = {
  joinRoom: z.object({
    producer: z.string().min(1, 'Producer ID is required'),
    consumer: z.string().min(1, 'Consumer ID is required'),
  }),

  joinGroupRoom: z.object({
    group_id: z.string().min(1, 'Group ID is required'),
    user_id: z.string().min(1, 'User ID is required'),
  }),

  chatMessage: z.object({
    content: z.string().min(1, 'Message content is required'),
    chat_id: z.string().optional(),
    group_id: z.string().optional(),
    sender_name: z.string().min(1, 'Sender name is required'),
    sender_id: z.string().min(1, 'Sender ID is required'),
    created_at: z.string().or(z.date()),
  }).refine((data) => data.chat_id || data.group_id, {
    message: 'Either chat_id or group_id is required',
  }),

  broadcastMessage: z.object({
    content: z.string().min(1, 'Broadcast content is required'),
    sender_id: z.string().min(1, 'Sender ID is required'),
    sender_name: z.string().min(1, 'Sender name is required'),
    sender_grado: z.string().optional(),
    target_roles: z.array(z.union([z.string(), z.number()])).min(1, 'At least one target role is required'),
    timestamp: z.string().or(z.date()),
  }),

  groupCreated: z.object({
    group_id: z.string().min(1, 'Group ID is required'),
    members: z.array(z.string()).min(1, 'At least one member is required'),
    created_by: z.string().min(1, 'Creator ID is required'),
  }),

  memberAddedToGroup: z.object({
    group_id: z.string().min(1, 'Group ID is required'),
    new_members: z.array(z.string()).min(1, 'At least one new member is required'),
  }),

  userLeftGroup: z.object({
    group_id: z.string().min(1, 'Group ID is required'),
    user_id: z.string().min(1, 'User ID is required'),
  }),

  groupDeleted: z.object({
    group_id: z.string().min(1, 'Group ID is required'),
    members: z.array(z.string()).optional(),
  }),
};

export const eventSchemas = {
  'join_room': schemas.joinRoom,
  'join_group_room': schemas.joinGroupRoom,
  'chat_message': schemas.chatMessage,
  'broadcast_message': schemas.broadcastMessage,
  'group_created': schemas.groupCreated,
  'member_added_to_group': schemas.memberAddedToGroup,
  'user_left_group': schemas.userLeftGroup,
  'group_deleted': schemas.groupDeleted,
};
