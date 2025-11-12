#!/usr/bin/env node

/**
 * TODO Manager Script
 *
 * Usage:
 *   node .memory-scripts/todo-manager.js <command> [options]
 *
 * Commands:
 *   list [status] [priority]  - List TODOs (filter by status/priority)
 *   add <title> <description>  - Add new TODO
 *   update <id> <field> <value> - Update TODO field
 *   complete <id>             - Mark TODO as completed
 *   delete <id>               - Delete TODO
 *   stats                     - Show TODO statistics
 *   export [format]           - Export TODOs (json/md/csv)
 */

const fs = require('fs');
const path = require('path');

const TODO_FILE = path.join(__dirname, '../.memory/todos/todos.json');

// Load TODOs from file
function loadTodos() {
  if (!fs.existsSync(TODO_FILE)) {
    return { version: "1.0.0", lastUpdated: new Date().toISOString(), todos: [], metadata: {} };
  }
  return JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
}

// Save TODOs to file
function saveTodos(data) {
  data.lastUpdated = new Date().toISOString();
  data.metadata = calculateMetadata(data.todos);
  fs.writeFileSync(TODO_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Calculate metadata
function calculateMetadata(todos) {
  const statusCounts = {};
  const priorityCounts = {};
  const categoryCounts = {};

  todos.forEach(todo => {
    statusCounts[todo.status] = (statusCounts[todo.status] || 0) + 1;
    priorityCounts[todo.priority] = (priorityCounts[todo.priority] || 0) + 1;
    categoryCounts[todo.category] = (categoryCounts[todo.category] || 0) + 1;
  });

  return {
    totalTodos: todos.length,
    statusCounts,
    priorityCounts,
    categoryCounts
  };
}

// Generate next TODO ID
function getNextId(todos) {
  if (todos.length === 0) return 'TODO-001';
  const ids = todos.map(t => parseInt(t.id.split('-')[1]));
  const maxId = Math.max(...ids);
  return `TODO-${String(maxId + 1).padStart(3, '0')}`;
}

// List TODOs
function listTodos(status = null, priority = null) {
  const data = loadTodos();
  let filtered = data.todos;

  if (status) {
    filtered = filtered.filter(t => t.status === status);
  }
  if (priority) {
    filtered = filtered.filter(t => t.priority === priority);
  }

  console.log('\n📋 TODOs:');
  console.log('─'.repeat(80));

  filtered.forEach(todo => {
    const statusIcon = {
      pending: '⏳',
      'in_progress': '🔄',
      completed: '✅'
    }[todo.status] || '❓';

    const priorityIcon = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    }[todo.priority] || '⚪';

    console.log(`${statusIcon} ${priorityIcon} [${todo.id}] ${todo.title}`);
    console.log(`   ${todo.description}`);
    console.log(`   Category: ${todo.category} | Tags: ${todo.tags.join(', ')}`);
    if (todo.relatedFiles.length > 0) {
      console.log(`   Files: ${todo.relatedFiles.slice(0, 2).join(', ')}${todo.relatedFiles.length > 2 ? '...' : ''}`);
    }
    console.log('');
  });

  console.log(`Total: ${filtered.length} TODOs`);
}

// Add new TODO
function addTodo(title, description, options = {}) {
  const data = loadTodos();
  const newTodo = {
    id: getNextId(data.todos),
    title,
    description,
    status: options.status || 'pending',
    priority: options.priority || 'medium',
    category: options.category || 'general',
    tags: options.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: options.dueDate || null,
    assignee: options.assignee || null,
    relatedFiles: options.relatedFiles || [],
    notes: options.notes || ''
  };

  data.todos.push(newTodo);
  saveTodos(data);
  console.log(`✅ Added TODO: ${newTodo.id} - ${title}`);
}

// Update TODO
function updateTodo(id, field, value) {
  const data = loadTodos();
  const todo = data.todos.find(t => t.id === id);

  if (!todo) {
    console.error(`❌ TODO not found: ${id}`);
    return;
  }

  todo[field] = value;
  todo.updatedAt = new Date().toISOString();
  saveTodos(data);
  console.log(`✅ Updated ${id}: ${field} = ${value}`);
}

// Complete TODO
function completeTodo(id) {
  const data = loadTodos();
  const todo = data.todos.find(t => t.id === id);

  if (!todo) {
    console.error(`❌ TODO not found: ${id}`);
    return;
  }

  todo.status = 'completed';
  todo.completedAt = new Date().toISOString();
  todo.updatedAt = new Date().toISOString();
  saveTodos(data);
  console.log(`✅ Completed TODO: ${id} - ${todo.title}`);
}

// Delete TODO
function deleteTodo(id) {
  const data = loadTodos();
  const index = data.todos.findIndex(t => t.id === id);

  if (index === -1) {
    console.error(`❌ TODO not found: ${id}`);
    return;
  }

  const deleted = data.todos.splice(index, 1)[0];
  saveTodos(data);
  console.log(`🗑️ Deleted TODO: ${id} - ${deleted.title}`);
}

// Show statistics
function showStats() {
  const data = loadTodos();
  const meta = data.metadata;

  console.log('\n📊 TODO Statistics:');
  console.log('─'.repeat(50));
  console.log(`Total TODOs: ${meta.totalTodos}`);
  console.log('\nBy Status:');
  Object.entries(meta.statusCounts).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  console.log('\nBy Priority:');
  Object.entries(meta.priorityCounts).forEach(([priority, count]) => {
    console.log(`  ${priority}: ${count}`);
  });
  console.log('\nBy Category:');
  Object.entries(meta.categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
}

// Export TODOs
function exportTodos(format = 'md') {
  const data = loadTodos();
  const timestamp = new Date().toISOString().split('T')[0];
  const outputDir = path.join(__dirname, '../.memory/todos/exports');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (format === 'md') {
    const outputFile = path.join(outputDir, `todos-${timestamp}.md`);
    let content = `# TODO List - ${timestamp}\n\n`;

    ['pending', 'in_progress', 'completed'].forEach(status => {
      const todos = data.todos.filter(t => t.status === status);
      if (todos.length === 0) return;

      content += `## ${status.toUpperCase().replace('_', ' ')}\n\n`;
      todos.forEach(todo => {
        content += `### [${todo.id}] ${todo.title}\n\n`;
        content += `**Description**: ${todo.description}\n\n`;
        content += `**Priority**: ${todo.priority} | **Category**: ${todo.category}\n\n`;
        content += `**Tags**: ${todo.tags.join(', ')}\n\n`;
        if (todo.relatedFiles.length > 0) {
          content += `**Related Files**:\n${todo.relatedFiles.map(f => `- ${f}`).join('\n')}\n\n`;
        }
        if (todo.notes) {
          content += `**Notes**: ${todo.notes}\n\n`;
        }
        content += '---\n\n';
      });
    });

    fs.writeFileSync(outputFile, content, 'utf8');
    console.log(`✅ Exported to: ${outputFile}`);
  } else if (format === 'json') {
    const outputFile = path.join(outputDir, `todos-${timestamp}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Exported to: ${outputFile}`);
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'list':
    listTodos(args[1], args[2]);
    break;
  case 'add':
    addTodo(args[1], args[2]);
    break;
  case 'update':
    updateTodo(args[1], args[2], args[3]);
    break;
  case 'complete':
    completeTodo(args[1]);
    break;
  case 'delete':
    deleteTodo(args[1]);
    break;
  case 'stats':
    showStats();
    break;
  case 'export':
    exportTodos(args[1] || 'md');
    break;
  default:
    console.log('Usage: node todo-manager.js <command> [options]');
    console.log('Commands: list, add, update, complete, delete, stats, export');
}
