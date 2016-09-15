package com.pwc.adc.realtime.repository;

import com.pwc.adc.realtime.domain.Checklist_template;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Checklist_template entity.
 */
@SuppressWarnings("unused")
public interface Checklist_templateRepository extends JpaRepository<Checklist_template,Long> {

}
