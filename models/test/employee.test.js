const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose')

describe('Employee', () => {

  it('should throw an error if no arg', () => {
    const emp = new Employee({});

    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });

  });

  it('should throw an error if "firstName", "lastName" or "department" is not string', () => {

    const cases = [
      { firstName: {}, lastName: {}, department: {} },
      { firstName: [], lastName: [], department: [] }];
    for (let item of cases) {
      const emp = new Employee({ firstName: item.firstName, lastName: item.lastName, department: item.department });

      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });




  it('should validate if "firstName", "lastName" or "department" are strings', () => {

    const cases = [
      { firstName: 'test', lastName: 'testowy', department: 'test' },
      { firstName: 'rob', lastName: 'stark', department: 'warrior' }];
    for (let item of cases) {
      const emp = new Employee({ firstName: item.firstName, lastName: item.lastName, department: item.department });

      emp.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });
  after(() => {
    mongoose.models = {};
  });
});