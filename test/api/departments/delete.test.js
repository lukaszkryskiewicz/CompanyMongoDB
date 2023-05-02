const chai = require('chai');
const chaiHttp = require('chai-http');
const Department = require('../../../models/department.model');
const server = require('../../../server.js');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {
  before(async () => {
    const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
    await testDepOne.save();
  });

  it('/:id should delete chosen document and return success', async () => {
    const deletedDepartment = await Department.findOne({ _id: '5d9f1140f10a81216cfd4408' });
    const res = await request(server).delete('/api/departments/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body.name).to.be.equal(deletedDepartment.name);

  });


});