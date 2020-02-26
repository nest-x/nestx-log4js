import * as proxyquire from 'proxyquire';

export class FakeAMQPConnectionManager {
  private urls;
  private options;

  constructor(urls, options) {
    this.urls = urls;
    this.options = options;
  }
}
