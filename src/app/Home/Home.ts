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

    selectedfeatures: boolean[] = [];

    constructor(private router: Router){
        this.selected = "Select City/State";
        this.signInRequired = false;
        if(localStorage.getItem("Username")==null){
            this.signInRequired = true;         //Checking whether the user is Signed in
        }
        else{
            this.generateData();        //Fuction call to fetch data
        }
    }

    generateData(){             
        if(localStorage.getItem("Username")==null){
            return;
        }
        this.citiesandstates.add("None");

        //Iterating over all data and parsing them into College Model
        for(var i=0;i<data.length;i++){
            this.collegedata[i] = new College(data[i].name,data[i].year_founded,data[i].state,
                data[i].city,data[i].facilities);


            var re = /,/gi; 
            if(this.collegedata[i].Facilities.trim().length==0){
                //Marking Facilities as None if the column is empty
                this.collegedata[i].Facilities ="--";
            }
            else{
                //Removing Duplicates from the set of features provided(if any)

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
            //Storing College City and State Details
            this.citiesandstates.add(this.collegedata[i].City);
            this.citiesandstates.add(this.collegedata[i].State);
            this.collegedata[i].Facilities = this.collegedata[i].Facilities.replace(re,", ");
        }
        //Creating Array copy of set
        this.citiesandstatesarr = Array.from(this.citiesandstates);

        //Creating duplicate copies of the data to update with filters applied
        this.collegedatacopy = [...this.collegedata];
        this.collegedatamain =[...this.collegedatacopy];

        //Creating array of all unique features provided
        this.selectedfeatures.length = this.features.size;
        this.featuresarr = Array.from(this.features);
    }

    ngOnInit(){
        // Checking if User is Logged In or Not
    
        if(localStorage.getItem("Username")==null){
            this.signInRequired= true;
            return;
        }
        //Reinitializing data
        this.collegename='';
        this.collegedata = [...this.collegedatacopy];
    }

    collegename = '';           //Variable to store college name being entered in search box

    selectedCity(i:number){    //Funtion which gets invoked when  a City/State is selected
        this.collegename="";
        if(i==0){               //If None (option) is selected we re-intialize
            this.ngOnInit();
            this.selected = "Select City/State";
            return;
        }
        //Else, we filter data according to given state
        this.selected = this.citiesandstatesarr[i].toString();
        this.collegedata = [...this.collegedatacopy.filter(res=>{
            return res.City.match(this.selected) || res.State.match(this.selected);
        })]
    }

    Search(){                 //Function that gets invoked when a text is entered in search box
        this.p = 1;
        if(this.collegename.trim().length==0){
            if(this.selected=="Select City/State"){
                this.selectedCity(0);
            }
            else{
                this.citiesandstatesarr.indexOf(this.selected);
            }
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
    }


    key ='name';            // A key variable to order the elements in html page
    reverse=false;          // Boolean varaible to sort the elements
    sort(key:string){       //Function that gets invoked when user chooses to sort by clicking on label
        this.key = key;
        this.reverse= (!this.reverse);
    }
    
    //A function which is called when user selects a feature from checkbox
    selectedFeature(i: number){
        this.selectedfeatures[i] = !this.selectedfeatures[i];
        if(this.selectedfeatures[i]==true){
            this.nooffeaturesselected++;
        }
        else{
            this.nooffeaturesselected--;
        }

        //If No Feature is selected we reinitialize the data
        if(this.nooffeaturesselected==0){
            this.collegedatacopy = [...this.collegedatamain];
            this.collegedata = [...this.collegedatacopy];
        }
        else{
            this.filterData();
        }
        // console.log(i+" "+this.selectedfeatures[i]);
    }


    filterData(){               ///A function which is called when few features are selected
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

    matchedfeatures(col: College):number{  //This function returns number of features a college has in match with 
        var count =0;                       //the user selectedfeatures
        for(var i=0;i<this.selectedfeatures.length;i++){
            if(this.selectedfeatures[i] && col.Facilities.toLocaleLowerCase().indexOf(this.featuresarr[i].toLocaleLowerCase())!=-1){
                count++;
            }
        }
        return count;
    }
}