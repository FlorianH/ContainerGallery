/*
* MultiContainerGalleryJs is a small programm to create a picture
* gallery based on MultiContainerJs.
* 
* Copyright (C) 2009 Florian Herlings (florianherlings.de)
* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
* Version:    0.1
* Date:       02.08.2009
*/


var MultiContainerGallery = {

  'pictures': false,

  'num_pictures': false,

  'init': function() {
  
    $('gallery_pictures').style.display = "none";
    
    this.pictures = $$('#gallery_pictures img');
    this.num_pictures = this.pictures.length;
  
  
    this.add_containers();
    
  },//init()
  
  'add_containers': function() {
  
    for(i=this.num_pictures-1; i >= 0 ; i--)
      this.add_one_pic_container(i);

  },//init()


  'add_one_pic_container': function(picnum) {
  
    var picture = this.pictures[i];
  
    if (picture.title)
      picture.title = " - " + picture.title;
  
    var new_container
      = "<div class=\"container\" id=\"item"+(i+1)+"\">"
      +   "<div class=\"content start\">"
      +     "<a href=\"#\" onclick=\"MultiContainerHandler.next();\">"
      +       "<img src=\"" + picture.src + "\" />"
      +     "</a>"
      +   "</div>"
      +   "<div class=\"desc\">"
      +     (i+1) + "/" + this.num_pictures
      +     picture.title
      +   "</div>"
      + "</div>";

    $('loading').insert({after: new_container});
  
  }//add_one_pic_container()


}//MultiContainerGallery




//Init for the gallery AND the ContainerHandler

document.observe("dom:loaded", function() {
  MultiContainerGallery.init();
  MultiContainerHandler.init();
});

window.onload = function() {
  MultiContainerHandler.next(); //Selects the first item
  ResizeDetector.init();
};
