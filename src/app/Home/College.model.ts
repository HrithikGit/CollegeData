export class College{
    Name : string= "";
    Year : string= "";
    City : string= "";
    State : string= "";
    Facilities : string ="";
    constructor(name:string,year:string,city:string,state:string,facilities:string){
        this.Name = name;
        this.Year = year;
        this.City = city;
        this.State = state;
        this.Facilities = facilities;
    }
}