/**
 * Title: MemoryGame Refactor
 * Date: 07/15/2014
 * Author: Daniel Wheeler <dwheeler@customink.com>
 */

function MemoryGame() {
    this.turnsCount = 0;
    this.clickCount = 0;
    this.firstSelect = null;
    this.secondSelect = null;
    this.isAnimating = false;
    this.newGame();
}

/**
 * Start a new game
 */
MemoryGame.prototype.newGame = function() {
    this.createGameBoard();
    this.populateCards();
};

/**
 * Bind click event for making card selections
 */
MemoryGame.prototype.bindSelectEvent = function() {
    $(document).bind("click", ".card:not(.found)", this.makeSelection.bind(this));
};

/**
 * Create the game board
 */
MemoryGame.prototype.createGameBoard = function() {
    $('<div id="memory-game-board"></div>').appendTo($('body'));
};

/**
 * Populate  game board with cards
 */
MemoryGame.prototype.populateCards = function() {
    // Create the cards
    var cards = this.createCards();

    var html = [];
    for (var i = 0, len = cards.length; i < len; i++) {
        html.push('<div class="card" data-id="' + (i + 1) + '"\
            data-value="' + cards[i] + '">?</div>');
    }

    // Get game board parent
    var gameBoard = $('#memory-game-board');
    var pageBody  = gameBoard.parent();

    // Detach the game board, append cards, and then place board back on DOM
    gameBoard.detach().append(html.join(''));
    pageBody.append(gameBoard);

    // Bind card selection event
    this.bindSelectEvent();
};

/**
 * Create cards for populating the board
 */
MemoryGame.prototype.createCards = function() {
    var cards = this.shuffleCards($.merge(
        this.createArray(12),
        this.createArray(12)
    ));

    return cards;
};

/**
 * Create an array [1,2,3,4,5,6,7,8,9,10,11,12]
 */
MemoryGame.prototype.createArray = function(number) {
    var array = new Array(number)
        .join()
        .split(',')
        .map(function(item, index){ return ++index;});

    return array;
};

/**
 * Shuffle them cards
 */
MemoryGame.prototype.shuffleCards = function(cards) {
    for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }

    return cards;
};

/**
 * Make a card selection by clicking on a card
 */
MemoryGame.prototype.makeSelection = function(event) {
    // Check for active animation
    if (this.isAnimating) return;

    // Increment the click counter
    this.clickCount++;

    var $target   = $(event.target);
    var cardID    = $target.attr('data-id');
    var cardValue = $target.attr('data-value');

    if (this.turnsCount === 0) {
        this.firstSelect = [cardID, cardValue];
        this.turnsCount = 1;
        this.showCard(cardID);
    } else if (this.turnsCount === 1) {
        this.secondSelect = [cardID, cardValue];
        this.turnsCount = 2;
        this.showCard(cardID);
        this.compareSelections();
    } else {
        return;
    }
};

/**
 * Flip a card to show the card value on the front side
 */
MemoryGame.prototype.showCard = function(cardID) {
    var $card = $('.card[data-id="' + cardID + '"]');

    $.Deferred(function(def) {
        $card.addClass('flipOutX');
        setTimeout(function() { def.resolve(); }, 600);
    }).then(function() {
        $card.removeClass('flipOutX')
            .addClass('front-side')
            .html($card.attr('data-value'));
    });
};

/**
 * Flip a card to hide the front side
 */
MemoryGame.prototype.hideCards = function(firstSelectID, secondSelectID) {
    var $firstCard  = $('.card[data-id="' + firstSelectID + '"]');
    var $secondCard = $('.card[data-id="' + secondSelectID + '"]');

    var self = this;
    $.Deferred(function(def) {
        $firstCard.add($secondCard).addClass('flipOutX');
        setTimeout(function() { def.resolve(); }, 600);
    }).then(function() {
        $firstCard
            .add($secondCard)
            .removeClass('flipOutX front-side')
            .html('?');
    });
};

/**
 * Compare the selected cards
 */
MemoryGame.prototype.compareSelections = function() {
    if (this.firstSelect[1] === this.secondSelect[1]) {
        this.matchFound();
    } else {
        this.noMatchFound();
    }
};

/**
 * Match found
 */
MemoryGame.prototype.matchFound = function() {
    this.pairFound(this.firstSelect[0], this.secondSelect[0])
    this.turnsCount = 0;
};

/**
 * No match was found
 */
MemoryGame.prototype.noMatchFound = function() {
    var self = this;

    $.Deferred(function(def) {
        self.isAnimating = true;
        setTimeout(function() { def.resolve(); }, 1500);
    }).then(function() {
        self.hideCards(self.firstSelect[0], self.secondSelect[0]);
        self.turnsCount = 0;
        self.isAnimating = false;
    });
};

/**
 * Great! You successfully made a match!
 */
MemoryGame.prototype.pairFound = function(firstSelectID, secondSelectID) {
    var $firstCard  = $('.card[data-id="' + firstSelectID + '"]');
    var $secondCard = $('.card[data-id="' + secondSelectID + '"]');

    $firstCard.add($secondCard).addClass('found');
};










