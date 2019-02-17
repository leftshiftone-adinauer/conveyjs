import SampleData from './data/SampleData';

export default class LineOptions {
    public width:number = 500;
    public height:number = 500;
    public margin = {top:20, right:20, bottom:30, left:40};
    public data:Promise<any> = Promise.resolve(SampleData);
}
