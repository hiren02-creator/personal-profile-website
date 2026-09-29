import test from 'node:test'
import assert from 'node:assert/strict'
import { validateContactField as validate } from './contactValidation.js'

test('names support international names, single names and punctuation', () => {
  for (const name of ['李', 'હિરેન', "O’Connor", 'Jean-Luc', '  Hiren  ']) {
    assert.equal(validate('name', name), '', name)
  }
  for (const name of ['', ' \n ', '123', '---', 'A'.repeat(121)]) {
    assert.ok(validate('name', name), name)
  }
})

test('email accepts common addresses and rejects malformed addresses', () => {
  for (const email of ['hiren@example.com', 'hi+work@sub.example.co.in', '  A.B@example.com  ']) {
    assert.equal(validate('email', email), '', email)
  }
  for (const email of ['', ' ', 'a@', '@example.com', 'a@example', 'a@@example.com',
    'a b@example.com', '.a@example.com', 'a..b@example.com', 'a.@example.com',
    'a@-example.com', 'a@example-.com', 'a@example..com', 'a@example.com.',
    'a@' + 'x'.repeat(64) + '.com', 'x'.repeat(65) + '@example.com']) {
    assert.ok(validate('email', email), email)
  }
})

test('messages require some content and detail, with existing length limit', () => {
  for (const message of ['', '   ', 'Hi', '..........', '  hello  ', 'a'.repeat(5001)]) {
    assert.ok(validate('message', message), message.slice(0, 30))
  }
  for (const message of ['Let’s collaborate.', '  Project 42 sounds interesting.  ', 'a'.repeat(5000)]) {
    assert.equal(validate('message', message), '')
  }
})

test('all empty fields block sending and corrected values pass', () => {
  const invalid = { name: ' ', email: 'invalid', message: ' ' }
  assert.ok(Object.entries(invalid).every(([key, value]) => validate(key, value)))
  const valid = { name: 'Hiren', email: 'hi@example.com', message: 'I have a project idea.' }
  assert.ok(Object.entries(valid).every(([key, value]) => !validate(key, value)))
})