import _ from 'lodash';

const beUrl = 'http://localhost:3003/api/';
const testUser = {
  username: 'username',
  password: 'password',
};

const testUser2 = {
  username: 'username2',
  password: 'password2',
};

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${beUrl}testing/reset`);
    cy.request('POST', `${beUrl}users`, testUser);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Login to application');
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input:first').type(testUser.username);
      cy.get('input:last').type(testUser.password);
      cy.contains('login').click();
      cy.contains('blogs');
    });

    it('fails with wrong credentials', function () {
      cy.get('input:first').type('wrong');
      cy.get('input:last').type('cred');
      cy.contains('login').click();
      cy.get('.error').should('contain', 'wrong username or password');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('input:first').type(testUser.username);
      cy.get('input:last').type(testUser.password);
      cy.contains('login').click();
      cy.contains('blogs');
    });

    it('A blog can be created', function () {
      cy.contains('create').click();

      const testBlog = {
        title: 'Test',
        author: 'tester',
        url: 'www.test.com',
      };

      cy.get('#input-title').type(testBlog.title);
      cy.get('#input-author').type(testBlog.author);
      cy.get('#input-url').type(testBlog.url);

      cy.get('#submit-blog').click();
      cy.contains(`${testBlog.title} ${testBlog.author}`);
      cy.contains('view');
    });
  });

  describe('When logged in and blog created', function () {
    beforeEach(function () {
      cy.get('input:first').type(testUser.username);
      cy.get('input:last').type(testUser.password);
      cy.contains('login').click();
      cy.contains('blogs');

      cy.contains('create').click();

      const testBlog = {
        title: 'Test',
        author: 'tester',
        url: 'www.test.com',
      };

      cy.get('#input-title').type(testBlog.title);
      cy.get('#input-author').type(testBlog.author);
      cy.get('#input-url').type(testBlog.url);

      cy.get('#submit-blog').click();
      cy.contains(`${testBlog.title} ${testBlog.author}`);
    });

    it('A blog can be liked', function () {
      cy.contains('view').click();
      cy.contains('like').click();
      cy.contains('likes 1');
    });

    it('A blog can be removed', function () {
      cy.contains('view').click();
      cy.contains('remove').click();
      cy.contains('Test tester').should('not.exist');
    });

    it('Only blog creator can see remove blog button', function () {
      cy.request('POST', `${beUrl}users`, testUser2);

      cy.contains('logout').click();

      cy.get('input:first').type(testUser2.username);
      cy.get('input:last').type(testUser2.password);
      cy.contains('login').click();

      cy.contains('view').click();
      cy.contains('remove').should('not.exist');
    });
  });
});
