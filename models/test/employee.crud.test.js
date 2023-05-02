const Employee = require('../employee.model.js');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const departmentModel = require('../department.model.js');

describe('Employee', () => {

  before(async () => {

    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'Test1FN', lastName: 'Test1LN', department: 'Test1DP' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Test2FN', lastName: 'Test2LN', department: 'Test2DP' });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);

    });

    it('should return a proper document by various params with "findOne" method', async () => {
      const employeeByFirstName = await Employee.findOne({ firstName: 'Test1FN' });
      const expectedFirstName = 'Test1FN';
      const employeeByLastName = await Employee.findOne({ lastName: 'Test1LN' });
      const expectedLastName = 'Test1LN';
      const employeeByDepartment = await Employee.findOne({ department: 'Test1DP' });
      const expectedDepartment = 'Test1DP';
      expect(employeeByFirstName.firstName).to.be.equal(expectedFirstName);
      expect(employeeByLastName.lastName).to.be.equal(expectedLastName);
      expect(employeeByDepartment.department).to.be.equal(expectedDepartment);
    });

    it('should return proper department data with "find" method using populate(\'department\')', async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
      const department = await Department.findOne({ name: 'Department #1' })

      const testEmpThree = new Employee({ firstName: 'Test3FN', lastName: 'Test4LN', department: department.id });
      await testEmpThree.save();

      const employee = await Employee.findOne({ firstName: 'Test3FN' }).populate('department')

      expect(employee.department.name).to.be.equal(department.name);
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Test1FN', lastName: 'Test1LN', department: 'Test1DP' });
      await employee.save();
      const savedEmployee = await Employee.findOne({ lastName: 'Test1LN' });
      expect(savedEmployee).to.not.be.null;
    });

    it('should insert new document with "insertOne" method using isNew', async () => {
      const employee = new Employee({ firstName: 'Test2FN', lastName: 'Test2LN', department: 'Test2DP' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Test1FN', lastName: 'Test1LN', department: 'Test1DP' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Test2FN', lastName: 'Test2LN', department: 'Test2DP' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Test1FN' }, { $set: { firstName: 'Test1Updated' } });
      const updatedEmployee = await Employee.findOne({ firstName: 'Test1Updated' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Test1FN' });
      employee.firstName = 'Test1Updated';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Test1Updated' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'Updated!' } });
      const employees = await Employee.find({ lastName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Test1FN', lastName: 'Test1LN', department: 'Test1DP' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Test2FN', lastName: 'Test2LN', department: 'Test2DP' });
      await testEmpTwo.save();
    });


    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Test1FN' });
      const removedEmployee = await Employee.findOne({ firstName: 'Test1FN' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ lastName: 'Test2LN' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ lastName: 'Test2LN' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany({});
      const employees = await Employee.find({});
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

});