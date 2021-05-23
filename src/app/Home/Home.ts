import {Component,OnInit} from "@angular/core";
import { Router } from "@angular/router";
import  data from "../Data/data.json";
import 'bootstrap/dist/js/bootstrap.bundle';
import {College} from "./College.model";

@Component({
    templateUrl : "./Home.html",
    styleUrls : ["./Home.css"]
})

export class HomeComponent{
    selected;
    nooffeaturesselected: number = 0;
    citiesandstates : Set<String>=new Set<string>();
    citiesandstatesarr: String[] =[];
    abc:string[]=[];
    collegedata:College[] = data;
    signInRequired : boolean;
    set: Set<string> = new Set<string>();
    collegedatacopy:College[]=[];
    collegedatamain:College[]=[];
    p: number=1;

    featuresarr: Array<string> = [];
    features: Set<string> = new Set<string>();
    loading: boolean = false;

    selectedfeatures: boolean[] = [];

    constructor(private router: Router){
        this.loading = true;
        this.selected = "Select City/State";
        this.signInRequired = false;
        if(localStorage.getItem("Username")==null){
            this.signInRequired = true;
        }
        else{
            this.generateData();
        }
    }

    generateData(){
        if(localStorage.getItem("Username")==null){
            return;
        }
        this.citiesandstates.add("None");
        for(var i=0;i<data.length;i++){
            this.collegedata[i] = new College(data[i].name,data[i].year_founded,data[i].state,
                data[i].city,data[i].facilities);


            var re = /,/gi; 
            if(this.collegedata[i].Facilities.trim().length==0){
                this.collegedata[i].Facilities ="--";
            }
            else{
                var faci = this.collegedata[i].Facilities.split(",");
                for(var j=0;j<faci.length;j++){
                    this.set.add(faci[j]);
                    if(!this.features.has(faci[j].toUpperCase())){
                        this.features.add(faci[j].toUpperCase());
                    }
                }
                this.collegedata[i].Facilities = [...this.set].toString(); 
                this.set.clear();
            }
            this.citiesandstates.add(this.collegedata[i].City);
            this.citiesandstates.add(this.collegedata[i].State);
            this.collegedata[i].Facilities = this.collegedata[i].Facilities.replace(re,", ");
        }
        this.citiesandstatesarr = Array.from(this.citiesandstates);
        this.collegedatacopy = [...this.collegedata];
        this.collegedatamain =[...this.collegedatacopy];
        this.loading = false;
        this.selectedfeatures.length = this.features.size;
        this.featuresarr = Array.from(this.features);
    }

    ngOnInit(){
        if(localStorage.getItem("Username")==null){
            this.signInRequired= true;
            return;
        }
        this.collegename='';
        this.collegedata = [...this.collegedatacopy];
    }

    collegename = '';

    clickeditem(i:number){
        this.collegename="";
        if(i==0){
            this.ngOnInit();
            this.selected = "Select City/State";
            return;
        }
        this.selected = this.citiesandstatesarr[i].toString();
        this.collegedata = [...this.collegedatacopy.filter(res=>{
            return res.City.match(this.selected) || res.State.match(this.selected);
        })]
    }

    Search(){
        this.p = 1;
        this.loading = true;
        console.log("Came Here !");
        if(this.collegename.trim().length==0){
            if(this.selected=="Select City/State"){
                this.clickeditem(0);
            }
            else{
                this.citiesandstatesarr.indexOf(this.selected);
            }
            this.loading = false;
            return;
        }
        this.collegedata = this.collegedatacopy.filter(res=>{
            
            //If a State/City is Already Selected while Searching
            if(this.selected!="Select City/State"){
                return res.Name.toLocaleLowerCase().match(this.collegename.toLocaleLowerCase()) &&
                    (res.City == this.selected || res.State==this.selected);
            }

            //If No State/City is specified
            return res.Name.toLocaleLowerCase().match(this.collegename.toLocaleLowerCase());
        })
        this.loading = false;
    }


    key ='name';
    reverse=false;
    sort(key:string){
        this.key = key;
        this.reverse= (!this.reverse);
    }
    
    selectedFeature(i: number){
        this.selectedfeatures[i] = !this.selectedfeatures[i];
        if(this.selectedfeatures[i]==true){
            this.nooffeaturesselected++;
        }
        else{
            this.nooffeaturesselected--;
        }

        console.log(this.nooffeaturesselected);

        if(this.nooffeaturesselected==0){
            this.collegedatacopy = [...this.collegedatamain];
            this.collegedata = [...this.collegedatacopy];
        }
        else{
            this.filterData();
        }
        console.log(i+" "+this.selectedfeatures[i]);
    }

    filterData(){
        this.collegename ="";
        this.p= 1;
        this.selected = "Select City/State";
        this.collegedatacopy = [...this.collegedatamain];
        this.sortAccordingtoSelected(this.collegedatacopy);  //Sorting according to number of features selected
        this.collegedata = [... this.collegedatacopy];
    }

    sortAccordingtoSelected(list : College[]){
        list.sort((a,b)=> this.matchedfeatures(a)-this.matchedfeatures(b))
    }
    matchedfeatures(col: College):number{
        var count =0;
        for(var i=0;i<this.selectedfeatures.length;i++){
            if(this.selectedfeatures[i] && col.Facilities.toLocaleLowerCase().indexOf(this.featuresarr[i].toLocaleLowerCase())!=-1){
                count++;
            }
        }
        return count;
    }
}