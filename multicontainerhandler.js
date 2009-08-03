/*
* MultiContainerJs is a small programm to automatically throw around
* boxes in a browser window.
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
* Version:    0.3
* Date:       02.08.2009
*/






/**
* The Positions object hods the screen positions for
* the animation key points:
* - ehe starting point for the animation (start)
* - the ending point for the animation (stop)
* - the point, where the animated object is supposed
*   to be while it is selected.
*
* This object is used by the ContainerHandler object.
*/
var Positions = {

  _center: function() {
  
    return {
      x: document.viewport.getWidth() /2,
      y: document.viewport.getHeight() /2
    }
      
  },//_center()

  start: function( id ) {
  
    return {
      x: document.viewport.getWidth(),
      y: document.viewport.getHeight() }
  
  },//start()
  
  middle: function( id ) {
  
    return {
      x: Positions._center().x - $(id).getWidth() /2,
      y: (Positions._center().y - $(id).getHeight() /2)*0.9 //The 0.9 is because geometrical center != optical center
    } 
  
  },//middle()
  
  stop: function( id ) {

    return {
      x: $(id).getWidth() *-1,
      y: $(id).getHeight() *-1 }
  
  }//stop()

}//Positions



/**
* The ResizeDetector object checks the window sizes
* every second to detect if the window has been resized.
* If this is the case, it calls the "correct_position"
* function on the MultiContainerHandler, which pushes
* all the containers to their new positions.
*/
var ResizeDetector = {

  init: function() {
  
    ResizeDetector.buffer = document.viewport.getDimensions();
    new PeriodicalExecuter(ResizeDetector.check, 1);
    
  }, //init()
  
  check: function() {
    
    now = document.viewport.getDimensions();
    
    if ((now.width != ResizeDetector.buffer.width) || (now.height != ResizeDetector.buffer.height)) {
      MultiContainerHandler.correct_position();
      ResizeDetector.buffer = document.viewport.getDimensions();
    }
    
  }//check()

}//ResizeDetector




var ContainerHandler = {

  /**
  * Moves the item just above the top left position
  * of the browser's viewport.
  */
  init: function( id ) {

    //top left
    $(id).setStyle({
      left: Positions.start(id).x+"px",
      top: Positions.start(id).y+"px",
      opacity: 0.0
    });

  },//init()

  show: function( id ) {

    new_position = Positions.middle(id);
    new_position.mode = 'absolute';
    
    new Effect.Parallel([
      new Effect.Move(id, new_position),
      new Effect.Opacity(id, {to: 1.0})
    ],{ duration: 0.4, transition: Effect.Transitions.sinoidal });

  },//show()

  hide: function( id ) {

    new_position = Positions.stop(id);
    new_position.mode = 'absolute';

    new Effect.Parallel([
      new Effect.Move(id, new_position),
      new Effect.Opacity(id, {to: 0.0})
    ],{ duration: 0.4, afterFinish: function() {ContainerHandler.init(id);} });

  }//hide()

}//ContainerHandler





var MultiContainerHandler = {

  init: function() {

    if ($('loading')){
      ContainerHandler.init('loading');
      ContainerHandler.show('loading');
    }

    MultiContainerHandler.current = -1;

    MultiContainerHandler.containers = $$('.container');


    MultiContainerHandler.containers.each( function(item) {
      ContainerHandler.init(item.id);
    });

    $$('.button_next').each(function(button) {
      button.observe('click', MultiContainerHandler.next);
    });

  },//init()

  next: function() {
  
    if ($('loading')){
      ContainerHandler.hide('loading');
    }
    
    MultiContainerHandler.current++;
    if (MultiContainerHandler.current > MultiContainerHandler.containers.length-1) MultiContainerHandler.current = 0;

    var previous = MultiContainerHandler.current -1;
    if (previous < 0) previous = MultiContainerHandler.containers.length-1;

    ContainerHandler.hide(MultiContainerHandler.containers[previous].id);
    ContainerHandler.show(MultiContainerHandler.containers[MultiContainerHandler.current].id);

  },//next()


  correct_position: function() {
    ContainerHandler.show(MultiContainerHandler.containers[MultiContainerHandler.current].id);
  },//correct_position()


  jump_to: function(num) {

    //Do nothing, if the selected item is already the current item
    if (MultiContainerHandler.current == num-1) return false;
  
    //Hide the current item, make the selected item the current one and display
    //the current one (which has bacome the selected one)
    ContainerHandler.hide(MultiContainerHandler.containers[MultiContainerHandler.current].id);
    MultiContainerHandler.current = num-1;
    ContainerHandler.show(MultiContainerHandler.containers[MultiContainerHandler.current].id);
  }//jump_to


}//MultiContainerHandler



