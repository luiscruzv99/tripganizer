import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const board = sqliteTable('board', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	short_code: text('short_code').notNull().unique(),
	name: text('name').notNull(),
	description: text('description'),
	created_date: text('created_date').notNull(),
	start_date: text('start_date'),
	end_date: text('end_date')
});

export const card = sqliteTable('card', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	board_id: text('board_id')
		.notNull()
		.references(() => board.id),
	name: text('name').notNull(),
	type: text('type').notNull(),
	description: text('description'),
	external_link: text('external_link'),
	header_img: text('header_img'),
	price: real('price'),
	start_date: text('start_date'),
	end_date: text('end_date'),
	duration: text('duration'),
	x_pos: real('x_pos'),
	y_pos: real('y_pos'),
	deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false)
});

export const yarn = sqliteTable('yarn', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	board_id: text('board_id')
		.notNull()
		.references(() => board.id),
	color: text('color').notNull(),
	free_field: text('free_field'),
	parent_card_id: text('parent_card_id').references(() => card.id)
});

export const yarnCard = sqliteTable('yarn_card', {
	yarn_id: text('yarn_id')
		.notNull()
		.references(() => yarn.id, { onDelete: 'cascade' }),
	card_id: text('card_id')
		.notNull()
		.references(() => card.id, { onDelete: 'cascade' })
});

export * from './auth.schema';
