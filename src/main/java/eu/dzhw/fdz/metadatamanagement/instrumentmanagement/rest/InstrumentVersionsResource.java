package eu.dzhw.fdz.metadatamanagement.instrumentmanagement.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eu.dzhw.fdz.metadatamanagement.instrumentmanagement.domain.Instrument;
import eu.dzhw.fdz.metadatamanagement.instrumentmanagement.service.InstrumentVersionsService;

/**
 * Rest Controller for retrieving previous version of the instrument domain object.
 * 
 * @author René Reitmann
 */
@RestController
@RequestMapping("/api")
public class InstrumentVersionsResource {

  @Autowired
  private InstrumentVersionsService instrumentVersionsService;

  /**
   * Get the previous 5 versions of the instrument.
   * 
   * @param id The id of the instrument
   * @param limit like page size
   * @param skip for skipping n versions
   * 
   * @return A list of previous instrument versions
   */
  @RequestMapping("/instruments/{id}/versions")
  public ResponseEntity<?> findPreviousInstrumentVersions(@PathVariable String id,
      @RequestParam(name = "limit", defaultValue = "5") Integer limit,
      @RequestParam(name = "skip", defaultValue = "0") Integer skip) {
    List<Instrument> instrumentVersions =
        instrumentVersionsService.findPreviousVersions(id, limit, skip);

    if (instrumentVersions == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(instrumentVersions);
  }
}
