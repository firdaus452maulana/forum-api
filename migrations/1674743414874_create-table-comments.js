/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    thread_id: {
      type: 'VARCHAR(50)'
    },
    owner: {
      type: 'VARCHAR(50)'
    },
    is_delete: {
      type: 'BOOLEAN'
    },
    date: {
      type: 'TEXT',
      notNull: true
    }
  })

  pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE')
  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.owner_threads.id')
  pgm.dropTable('comments')
}
