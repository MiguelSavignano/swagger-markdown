import { expect } from 'chai';
import { transformPath } from '../../src/transformers/path';

describe('Path transformer', () => {
  it('should return null if nothing was passed', () => {
    expect(transformPath(null, null)).to.be.equal(null);
    // I want to test this weird case as well
    // @ts-ignore
    expect(transformPath()).to.be.equal(null);
  });

  it('should present path as a subheader', () => {
    const fixture = {
      path: '/status',
      data: {},
    };
    const result = '### /status\n';
    const res = transformPath(fixture.path, fixture.data);
    expect(res).to.be.equal(result);
  });

  it('should present the method as a subheader italic', () => {
    const fixture = {
      path: '/',
      data: {
        get: {},
      },
    };
    const result = '#### GET';
    const res = transformPath(fixture.path, fixture.data).split('\n');
    expect(res[2]).to.be.equal(result);
  });

  it('should render summary if present', () => {
    const fixture = {
      path: '/',
      data: {
        get: {
          summary: 'Summary text',
        },
      },
    };
    const result = '##### Summary:\n\nSummary text'.split('\n');
    const res = transformPath(fixture.path, fixture.data).split('\n');
    expect(res[3]).to.be.equal(result[0]);
    expect(res[4]).to.be.equal(result[1]);
    expect(res[5]).to.be.equal(result[2]);
  });

  it('should render description if present', () => {
    const fixture = {
      path: '/',
      data: {
        get: {
          description: 'Description text',
        },
      },
    };
    const result = '##### Description:\n\nDescription text'.split('\n');
    const res = transformPath(fixture.path, fixture.data).split('\n');
    expect(res[3]).to.be.equal(result[0]);
    expect(res[4]).to.be.equal(result[1]);
    expect(res[5]).to.be.equal(result[2]);
  });
});
