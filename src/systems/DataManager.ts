import Phaser from 'phaser';

export class DataManager {
    static initialized: boolean = false;
    registry: Phaser.Data.DataManager;

    constructor(registry: Phaser.Data.DataManager) {
        this.registry = registry;
        
        if (!DataManager.initialized) {
            // Listen for changes and auto-save
            this.registry.events.on('changedata', this.saveData, this);
            this.registry.events.on('changedata-researchPoints', this.checkLevelUp, this);
            DataManager.initialized = true;
        }
    }

    checkLevelUp(_parent: any, value: number) {
        let currentLevel = this.registry.get('diverLevel');
        let xpNeeded = currentLevel * 100;
        
        if (value >= xpNeeded) {
            this.registry.set('researchPoints', value - xpNeeded);
            this.registry.set('diverLevel', currentLevel + 1);
            
            let currentMaxOxygen = this.registry.get('maxOxygen');
            // Level up increases Max Oxygen
            this.registry.set('maxOxygen', this.registry.get('maxOxygen') + 50);
            
            this.registry.events.emit('level_up', currentLevel + 1);
            
            // Re-check for multiple level ups
            this.checkLevelUp(_parent, this.registry.get('researchPoints'));
        }
    }

    saveData() {
        const dataToSave = {
            diverLevel: this.registry.get('diverLevel'),
            researchPoints: this.registry.get('researchPoints'),
            salvage: this.registry.get('salvage'),
            maxOxygen: this.registry.get('maxOxygen'),
            maxHealth: this.registry.get('maxHealth'),
            balloons: this.registry.get('balloons'),
            activeQuests: this.registry.get('activeQuests') || []
        };
        localStorage.setItem('divers_quest_save', JSON.stringify(dataToSave));
    }
}
