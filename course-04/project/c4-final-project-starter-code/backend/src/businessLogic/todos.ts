import { TodosAccess } from '../dataLayer/todosAcess'
import  createPresignedUrl  from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('todos')

const todosAccess = new TodosAccess()

// TODO: Implement businessLogic
export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const todoItem: TodoItem = {
    userId,
    todoId,
    createdAt,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false,
  }

  logger.info('Creating todo', todoItem)
  await todosAccess.createTodo(todoItem)
  logger.info('Todo was created')
  return todoItem
}

export async function getTodosForUser(
  userId: string
): Promise<TodoItem[]> {
  logger.info(`Getting todos for user {userId}`)
  const items = await todosAccess.getTodos(userId)
  return items
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  logger.info(`Updating todo ${todoId} for user ${userId}`)
  await todosAccess.updateTodo(userId, todoId, updatedTodo)
  logger.info(`Todo ${todoId} was updated`)
}

export async function deleteTodo(
  userId: string,
  todoId: string
):  Promise<void> {
  logger.info(`Deleting todo ${todoId} for user ${userId}`)
  await todosAccess.deleteTodo(userId, todoId)
  logger.info(`Todo ${todoId} deleted for user ${userId}`)
}

export async function createAttachmentPresignedUrl(
  userId: string,
  todoId: string,
): Promise<string> {
  logger.info(`Creating attachment for todo ${todoId} for user ${userId}`)
  const bucketname = process.env.ATTACHMENT_S3_BUCKET
  const imageId = uuid.v4()
  const attachmentUrl = `https://${bucketname}.s3.amazonaws.com/${imageId}`

  await todosAccess.createTodoAttachment(userId, todoId, attachmentUrl)
  logger.info(`Attachment for todo ${todoId} created for user ${userId}`)
  // Create a presigned URL for the S3 bucket
  const url = await createPresignedUrl(imageId)
  logger.info('Signed URL is:', url)
  return url
}