const Department = require('../department.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose')

describe('Department', () => {

  it('should throw an error if no "name" arg', () => {
    const dep = new Department({}); // create new Department, but don't set `name` attr value

    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });

  });

  it('should throw an error if "name" is not string', () => {

    const cases = [{}, []];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw an error if "name" length is not between 5 and 20', () => {

    const cases = [2, 'lorem ipsum lorem ipsum lorem'];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should validate if "name" fullfill requirements', () => {

    const cases = ['Adsdaw', 'lorem ipsum lorem'];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });

});