'use strict';

angular.module('metadatamanagementApp').config(
  function($translateProvider) {
    var translations = {
      //jscs:disable
      'data-acquisition-project-management': {
        'name': 'Name des Datenaufbereitungsprojektes',
        'release': {
          'version': 'Version des Datenaufbereitungsprojektes'
        },
        'home': {
          'title': 'Datenaufbereitungsprojekte',
          'createLabel': 'Neues Datenaufbereitungsprojekt anlegen',
          'releaseLabel': 'Das Datenaufbereitungsprojekt "{{ id }}" freigeben',
          'dialog-tooltip': {
            'create-ok': 'Klicken, um das Datenaufbereitungsprojekt zu erzeugen',
            'create-cancel': 'Klicken, um den Dialog zu schließen ohne ein Projekt anzulegen',
            'release-ok': 'Klicken, um das Projekt freizugeben',
            'release-cancel': 'Klicken, um den Dialog zu schließen ohne das Projekt freizugeben'
          }
        },
        'delete': {
          'question': 'Sind Sie sicher, dass Sie das Datenaufbereitungsprojekt "{{ name }}" löschen möchten?'
        },
        'log-messages': {
          'data-acquisition-project': {
            'saved': 'Datenaufbereitungsprojekt "{{ id }}" wurde erfolgreich gespeichert!',
            'server-error': 'Ein Fehler ist auf dem Server aufgetreten: ',
            'delete-title': 'Projekt "{{ id }}" löschen?',
            'delete': 'Möchten Sie wirklich das Projekt "{{ id }}" löschen? Das Projekt kann hiernach nicht wieder hergestellt werden.',
            'deleted-successfully-project': 'Das Datenaufbereitungsprojekt "{{ id }}" wurde erfolgreich gelöscht.',
            'deleted-not-successfully-project': 'Das Datenaufbereitungsprojekt "{{ id }}" konnte nicht gelöscht werden!',
            'released-successfully': 'Die Metadaten des Projektes wurden bei da|ra gespeichert und die Daten des Projektes "{{ id }}" werden in ca. 10 Minuten für alle Benutzer sichtbar sein.',
            'released-beta-successfully': 'Die Daten des Projektes "{{ id }}" werden in ca. 10 Minuten für alle Benutzer sichtbar sein. Es wurde keine Metadaten zu da|ra gesendet.',
            'dara-released-not-successfully': 'Die Daten des Projektes "{{ id }}" können nicht veröffentlicht werden. Es trat ein Fehler beim Senden der Metadaten zu da|ra auf.',
            'unreleased-successfully': 'Die Daten des Projektes "{{ id }}" werden in ca. 10 Minuten nur noch für Datengeber sichtbar sein.',
            'unrelease-title': 'Freigabe für Projekt "{{ id }}" zurücknehmen?',
            'unrelease': 'Möchten Sie wirklich, dass das Projekt "{{ id }}" nur noch für Datengeber sichtbar ist?',
            'release-not-possible-title': 'Projekt "{{ id }}" kann nicht freigegeben werden!',
            'release-not-possible': 'Das Projekt "{{ id }}" kann nicht freigegeben werden, weil bei der Post-Validierung Fehler aufgetreten sind!'
          }
        },
        'error': {
          'data-acquisition-project': {
            'id': {
              'not-empty': 'Der Name des Datenaufbereitungsprojekts darf nicht leer sein!',
              'pattern': 'Der Name eines Projektes darf nur aus Zahlen und kleinen Buchstaben (a-z) bestehen.',
              'size': 'Die Maximallänge des Names ist 32 Zeichen.',
              'exists': 'Es gibt bereits ein Datenaufbereitungsprojekt mit diesem Namen.'
            },
            'has-been-released-before': {
              'not-null': 'Es muss angegeben sein, ob ein des Datenaufbereitungsprojekts schon einmal veröffentlicht wurde oder nicht.'
            }
          },
          'release': {
            'version': {
              'not-empty': 'Die Version darf nicht leer sein.',
              'pattern': 'Die Version muss von der Form "major.minor.patch" (z.B. "1.0.0") sein.',
              'not-parsable-or-not-incremented': 'Die Versionsnummer muss mindestens so hoch sein wie die letzte Version. Die letzte Version war "{{lastVersion}}".',
              'size': 'Die Version darf nicht länger als 32 Zeichen sein.'
            }
          },
          'post-validation': {
            'project-has-no-study': 'Das Projekt mit der FDZID {{ id }} enthält keine Studie.'
          }
        }
      }
      //jscs:enable
    };
    $translateProvider.translations('de', translations);
  });
