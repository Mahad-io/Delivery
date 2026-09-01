'use strict';

const config = require('./config');

/**
 * Turns a resource definition into a downloadable file at request time.
 * Nothing is stored on disk, so there is no upload surface and no stale binary.
 */

function csvCell(value) {
  const s = value == null ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(resource) {
  const t = resource.table;
  if (!t) return null;
  const lines = [];
  lines.push(t.columns.map(csvCell).join(','));
  for (const row of t.sampleRows || []) {
    lines.push(t.columns.map((_, i) => csvCell(row[i])).join(','));
  }
  // Blank rows so the file is immediately usable as a working template.
  for (let i = 0; i < 12; i += 1) {
    lines.push(t.columns.map(() => '').join(','));
  }
  // Excel and Numbers both need the BOM to read UTF-8 reliably.
  return '﻿' + lines.join('\r\n') + '\r\n';
}

function toMarkdown(resource) {
  const out = [];
  out.push(`# ${resource.title}`);
  out.push('');
  out.push(`_${resource.summary}_`);
  out.push('');
  if (resource.why) {
    out.push(`> **Why it matters.** ${resource.why}`);
    out.push('');
  }

  if (resource.doc?.intro) {
    out.push(resource.doc.intro);
    out.push('');
  }

  for (const section of resource.doc?.sections || []) {
    out.push(`## ${section.heading}`);
    out.push('');
    for (const para of section.body || []) {
      out.push(para);
      out.push('');
    }
    for (const b of section.bullets || []) {
      out.push(`- ${b}`);
    }
    out.push('');
  }

  if (resource.table) {
    out.push('## Template');
    out.push('');
    out.push(`| ${resource.table.columns.join(' | ')} |`);
    out.push(`| ${resource.table.columns.map(() => '---').join(' | ')} |`);
    for (const row of resource.table.sampleRows || []) {
      out.push(
        `| ${resource.table.columns
          .map((_, i) => String(row[i] ?? '').replace(/\|/g, '\\|'))
          .join(' | ')} |`
      );
    }
    out.push('');
    out.push('_Example rows are illustrative. Delete them and add your own._');
    out.push('');
  }

  out.push('---');
  out.push('');
  if (resource.basedOn) {
    out.push(`**Based on:** ${resource.basedOn}`);
    out.push('');
  }
  out.push(
    `Downloaded from ${config.siteName} (${config.baseUrl}). Released under a Creative Commons Attribution 4.0 licence - use it, change it, share it, credit us.`
  );
  out.push('');
  return out.join('\n');
}

const MIME = {
  csv: 'text/csv; charset=utf-8',
  md: 'text/markdown; charset=utf-8'
};

function render(resource, format) {
  if (!resource) return null;
  if (!(resource.formats || []).includes(format)) return null;
  const body = format === 'csv' ? toCsv(resource) : toMarkdown(resource);
  if (body == null) return null;
  return {
    body,
    mime: MIME[format],
    filename: `${resource.id}.${format}`
  };
}

module.exports = { render, toCsv, toMarkdown };
